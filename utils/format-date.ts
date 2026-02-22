/**
 * Date formatting utilities
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/**
 * Format an ISO date string to "DD Mon YYYY"
 * e.g. "2026-01-23T14:00:00.000Z" → "23 Jan 2026"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}
