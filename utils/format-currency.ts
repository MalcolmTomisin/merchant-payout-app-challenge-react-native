/**
 * Currency formatting utilities
 * Converts amounts in lowest denomination (pence/cents) to display strings
 */
import type { Currency } from '@/types/api';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  EUR: '€',
};

/**
 * Get the currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

/**
 * Format an amount in lowest denomination (pence/cents) to a display string
 * e.g. formatCurrency(500000, 'GBP') → '£5,000.00'
 *      formatCurrency(-186154, 'GBP') → '-£1,861.54'
 */
export function formatCurrency(amountInLowestDenom: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const isNegative = amountInLowestDenom < 0;
  const absoluteAmount = Math.abs(amountInLowestDenom) / 100;

  const formatted = absoluteAmount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}
