/** The learner's own calendar day, "2026-11-18": it changes at local midnight. */
export function dailyKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The day key `days` after `day` (negative for before). */
export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return dailyKey(new Date(y, m - 1, d + days));
}

/** Whole days from `from` to `to`. */
export function daysBetween(from: string, to: string): number {
  const toTime = (day: string) => {
    const [y, m, d] = day.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toTime(to) - toTime(from)) / 86_400_000);
}
