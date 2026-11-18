/**
 * Spaced repetition for the revise list. Days are the learner's own calendar days
 * ("2026-11-18"), so an entry due tomorrow is due all of tomorrow, whatever the hour.
 */

import { GAME_CONFIG } from '@/config/game';
import { addDays, daysBetween } from '@/lib/utils/day';

import type { ReviseEntry } from '../progress/types';

const INTERVALS: readonly number[] = GAME_CONFIG.reviseIntervalsDays;

/** Older entries have no date and are due at once. */
export function isDue(entry: Pick<ReviseEntry, 'dueOn'>, today: string): boolean {
  return !entry.dueOn || entry.dueOn <= today;
}

/** The schedule after a miss: back to the start, due after the first gap. */
export function afterMiss(today: string): Pick<ReviseEntry, 'step' | 'dueOn'> {
  return { step: 0, dueOn: addDays(today, INTERVALS[0]) };
}

/**
 * The entry after a right answer: unchanged before it's due; when due, moved to the
 * next gap, or `null` (off the list) after the last one.
 */
export function afterRight(entry: ReviseEntry, today: string): ReviseEntry | null {
  if (!isDue(entry, today)) return entry;
  const step = (entry.step ?? 0) + 1;
  if (step >= INTERVALS.length) return null;
  return { ...entry, step, dueOn: addDays(today, INTERVALS[step]) };
}

/** Right answers still needed, on due days, to take the entry off the list. */
export function stepsLeft(entry: Pick<ReviseEntry, 'step'>): number {
  return INTERVALS.length - (entry.step ?? 0);
}

/** Whole days until the entry is due; 0 when it is due today or overdue. */
export function daysUntilDue(entry: Pick<ReviseEntry, 'dueOn'>, today: string): number {
  return isDue(entry, today) ? 0 : daysBetween(today, entry.dueOn!);
}

/** How many entries are due today. */
export function dueCount(
  revise: Readonly<Record<string, Pick<ReviseEntry, 'dueOn'>>>,
  today: string,
): number {
  return Object.values(revise).filter((entry) => isDue(entry, today)).length;
}
