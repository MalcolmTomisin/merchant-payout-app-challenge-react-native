import { formatDate } from '../format-date';

describe('formatDate', () => {
  it('formats an ISO date string to DD Mon YYYY', () => {
    expect(formatDate('2026-01-23T14:00:00.000Z')).toBe('23 Jan 2026');
  });

  it('zero-pads single-digit days', () => {
    expect(formatDate('2026-02-03T00:00:00.000Z')).toBe('03 Feb 2026');
  });
});
