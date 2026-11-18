/**
 * A small daily history of answers, for the Progress charts: answers per day and the
 * share right per week. No streaks: a day without play is just an empty bar.
 */

import { GAME_CONFIG } from '@/config/game';
import type { AnswerRecord } from '@/lib/game/scoring';
import { addDays } from '@/lib/utils/day';

import type { Progress } from './types';

type History = NonNullable<Progress['history']>;

/** Add a round's answers to `day`, keeping only the latest historyDays days. */
export function withHistory(
  history: History | undefined,
  day: string,
  answers: readonly AnswerRecord[],
): History {
  const before = history?.[day] ?? { answered: 0, correct: 0 };
  const next = {
    ...history,
    [day]: {
      answered: before.answered + answers.length,
      correct: before.correct + answers.filter((a) => a.isCorrect).length,
    },
  };
  const oldest = addDays(day, 1 - GAME_CONFIG.historyDays);
  return Object.fromEntries(Object.entries(next).filter(([d]) => d >= oldest));
}

export interface DayPoint {
  day: string;
  answered: number;
}

/** Answers on each of the last `days` days, oldest first, ending today. */
export function answersPerDay(
  history: History | undefined,
  today: string,
  days: number = GAME_CONFIG.chartDays,
): DayPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(today, i - days + 1);
    return { day, answered: history?.[day]?.answered ?? 0 };
  });
}

export interface WeekPoint {
  /** The week's last day. */
  end: string;
  answered: number;
  /** 0–1, or undefined for a week with no answers. */
  accuracy?: number;
}

/** The share right in each of the last `weeks` seven-day spans, oldest first, ending today. */
export function accuracyPerWeek(
  history: History | undefined,
  today: string,
  weeks: number = GAME_CONFIG.chartWeeks,
): WeekPoint[] {
  return Array.from({ length: weeks }, (_, w) => {
    const end = addDays(today, (w - weeks + 1) * 7);
    let answered = 0;
    let correct = 0;
    for (let d = 0; d < 7; d++) {
      const entry = history?.[addDays(end, -d)];
      answered += entry?.answered ?? 0;
      correct += entry?.correct ?? 0;
    }
    return { end, answered, accuracy: answered > 0 ? correct / answered : undefined };
  });
}
