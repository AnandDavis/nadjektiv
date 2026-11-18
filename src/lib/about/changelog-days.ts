import type { ChangelogEntry } from '@/content/changelog';

export interface ChangelogDay {
  /** The UTC calendar day, "2026-11-18": the timestamps are UTC (see changelog.ts). */
  day: string;
  entries: ChangelogEntry[];
}

/** The change log grouped by day, keeping its newest-first order within and across days. */
export function changelogDays(entries: readonly ChangelogEntry[]): ChangelogDay[] {
  const days: ChangelogDay[] = [];
  for (const entry of entries) {
    const day = new Date(entry.date).toISOString().slice(0, 10);
    const last = days[days.length - 1];
    if (last?.day === day) last.entries.push(entry);
    else days.push({ day, entries: [entry] });
  }
  return days;
}
