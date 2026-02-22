/**
 * Mask an IBAN for display in confirmation screens
 * Shows first 4 characters and last 4 characters, replacing the middle with asterisks.
 * e.g. "FR1212345123451234567A12310131231231231" → "FR12*******************************1231"
 */
export function maskIban(iban: string): string {
  if (iban.length <= 8) return iban;

  const prefix = iban.slice(0, 4);
  const suffix = iban.slice(-4);
  const masked = '*'.repeat(iban.length - 8);

  return `${prefix}${masked}${suffix}`;
}
