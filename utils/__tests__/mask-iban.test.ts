import { maskIban } from '../mask-iban';

describe('maskIban', () => {
  it('masks a standard IBAN keeping first 4 and last 4 chars', () => {
    const iban = 'FR1212345123451234567A12310131231231231';
    const result = maskIban(iban);

    expect(result.slice(0, 4)).toBe('FR12');
    expect(result.slice(-4)).toBe('1231');
    expect(result.length).toBe(iban.length);
    // Middle should be all asterisks
    const middle = result.slice(4, -4);
    expect(middle).toMatch(/^\*+$/);
  });

  it('returns the original string when length <= 8', () => {
    expect(maskIban('FR12AB')).toBe('FR12AB');
    expect(maskIban('FR121234')).toBe('FR121234');
  });

  it('handles a 9-character IBAN (edge case)', () => {
    const iban = 'FR12ABCD9';
    const result = maskIban(iban);
    expect(result).toBe('FR12*BCD9');
  });

  it('preserves iban length', () => {
    const ibans = [
      'GB29NWBK60161331926819',
      'DE89370400440532013000',
      'FR1212345123451234567A12310131231231231',
    ];
    for (const iban of ibans) {
      expect(maskIban(iban).length).toBe(iban.length);
    }
  });
});
