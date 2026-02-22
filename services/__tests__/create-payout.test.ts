import { createPayout } from '../api';

describe('createPayout', () => {
  it('creates a payout successfully', async () => {
    const result = await createPayout({
      amount: 40000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('amount', 40000);
    expect(result).toHaveProperty('currency', 'GBP');
    expect(result).toHaveProperty('iban');
    expect(result).toHaveProperty('created_at');
    expect(result.status).toBe('completed');
  });

  it('returns insufficient funds error for amount 88888', async () => {
    await expect(
      createPayout({
        amount: 88888,
        currency: 'GBP',
        iban: 'GB29NWBK60161331926819',
      }),
    ).rejects.toThrow('Insufficient funds');
  });

  it('returns service unavailable error for amount 99999', async () => {
    await expect(
      createPayout({
        amount: 99999,
        currency: 'GBP',
        iban: 'GB29NWBK60161331926819',
      }),
    ).rejects.toThrow('Service temporarily unavailable');
  });

  it('returns a failed status for amounts ending in X.99 (mod 100 === 99)', async () => {
    const result = await createPayout({
      amount: 10099, // £100.99
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    expect(result.status).toBe('failed');
  });

  it('includes device_id when provided', async () => {
    const result = await createPayout({
      amount: 5000,
      currency: 'EUR',
      iban: 'DE89370400440532013000',
      device_id: 'test-device-123',
    });

    expect(result.status).toBe('completed');
  });
});
