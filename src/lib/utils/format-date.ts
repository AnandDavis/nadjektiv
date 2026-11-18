/**
 * Locale-independent date formatting, so server and client render the same text
 * (no hydration mismatch) and every reader sees the same timestamp.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "18 Nov 2026, 13:02 UTC" */
export function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid timestamp: ${iso}`);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}
