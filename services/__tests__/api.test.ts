import { fetchMerchantData, fetchPaginatedActivity } from '../api';

describe('fetchMerchantData', () => {
  it('returns merchant data with balance and activity', async () => {
    const data = await fetchMerchantData();

    expect(data).toHaveProperty('available_balance');
    expect(data).toHaveProperty('pending_balance');
    expect(data).toHaveProperty('currency');
    expect(data).toHaveProperty('activity');
    expect(typeof data.available_balance).toBe('number');
    expect(typeof data.pending_balance).toBe('number');
    expect(['GBP', 'EUR']).toContain(data.currency);
    expect(Array.isArray(data.activity)).toBe(true);
    expect(data.activity.length).toBeGreaterThan(0);
  });

  it('returns activity items with expected shape', async () => {
    const data = await fetchMerchantData();
    const item = data.activity[0];

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('type');
    expect(item).toHaveProperty('amount');
    expect(item).toHaveProperty('currency');
    expect(item).toHaveProperty('date');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('status');
  });

  it('throws on server error', async () => {
    // Override with error-triggering fetch
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchMerchantData()).rejects.toThrow('Failed to fetch merchant data: 500');

    global.fetch = originalFetch;
  });
});

describe('fetchPaginatedActivity', () => {
  it('returns paginated activity with items, next_cursor, and has_more', async () => {
    const data = await fetchPaginatedActivity(null, 5);

    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('next_cursor');
    expect(data).toHaveProperty('has_more');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeLessThanOrEqual(5);
  });

  it('returns more items when cursor is provided', async () => {
    const firstPage = await fetchPaginatedActivity(null, 5);
    expect(firstPage.has_more).toBe(true);
    expect(firstPage.next_cursor).not.toBeNull();

    const secondPage = await fetchPaginatedActivity(firstPage.next_cursor, 5);
    expect(Array.isArray(secondPage.items)).toBe(true);
    expect(secondPage.items.length).toBeGreaterThan(0);

    // Ensure no overlapping IDs between pages
    const firstIds = new Set(firstPage.items.map((i) => i.id));
    const hasOverlap = secondPage.items.some((i) => firstIds.has(i.id));
    expect(hasOverlap).toBe(false);
  });

  it('throws on server error', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(fetchPaginatedActivity()).rejects.toThrow('Failed to fetch activity: 503');

    global.fetch = originalFetch;
  });
});
