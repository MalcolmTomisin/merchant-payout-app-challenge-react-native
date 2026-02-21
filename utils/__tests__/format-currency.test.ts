import { formatCurrency, getCurrencySymbol } from '../format-currency';

describe('getCurrencySymbol', () => {
  it('returns £ for GBP', () => {
    expect(getCurrencySymbol('GBP')).toBe('£');
  });

  it('returns € for EUR', () => {
    expect(getCurrencySymbol('EUR')).toBe('€');
  });
});

describe('formatCurrency', () => {
  it('formats a standard GBP amount', () => {
    expect(formatCurrency(500000, 'GBP')).toBe('£5,000.00');
  });

  it('formats a standard EUR amount', () => {
    expect(formatCurrency(25000, 'EUR')).toBe('€250.00');
  });

  it('formats amounts with pence correctly', () => {
    expect(formatCurrency(99999, 'GBP')).toBe('£999.99');
  });

  it('formats negative amounts (refunds) with minus prefix', () => {
    expect(formatCurrency(-186154, 'GBP')).toBe('-£1,861.54');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0, 'GBP')).toBe('£0.00');
  });

  it('formats small amounts correctly', () => {
    expect(formatCurrency(1, 'GBP')).toBe('£0.01');
  });

  it('formats large amounts with thousand separators', () => {
    expect(formatCurrency(10000000, 'EUR')).toBe('€100,000.00');
  });

  it('formats negative EUR amounts', () => {
    expect(formatCurrency(-50000, 'EUR')).toBe('-€500.00');
  });
});
