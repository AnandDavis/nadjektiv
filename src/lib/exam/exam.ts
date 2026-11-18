/**
 * Level tests (Prüfung): a mixed round across every topic of a level, without hints,
 * ending with a grade and the topics to go back to. The best result per level is kept.
 */

import { GAME_CONFIG } from '@/config/game';
import type { Level, Topic } from '@/content/types';
import { questionModes, topicItems, type SessionItem } from '@/lib/game/session';
import { shuffle, type Rng } from '@/lib/game/rng';
import { accuracy, type AnswerRecord } from '@/lib/game/scoring';
import type { Progress } from '@/lib/progress/types';

export const EXAM_LENGTH = GAME_CONFIG.examLength;
export const EXAM_LEVELS: readonly Level[] = ['A1', 'A2'];

export type Grade = keyof typeof GAME_CONFIG.examGrades | 'nichtBestanden';

/** "a1" in a URL to "A1", or undefined for anything else. */
export function levelFromParam(param: string): Level | undefined {
  return EXAM_LEVELS.find((level) => level.toLowerCase() === param);
}

/**
 * The test's questions: every topic of the level in turn, so each is asked at least
 * once before any is asked twice, then shuffled.
 */
export function buildExamSession(topics: readonly Topic[], rng: Rng): SessionItem[] {
  const pools = shuffle(topics, rng).map((topic) =>
    shuffle(
      questionModes(topic).flatMap((mode) => topicItems(topic, mode)),
      rng,
    ),
  );
  const picked: SessionItem[] = [];
  for (let round = 0; picked.length < EXAM_LENGTH; round++) {
    const takers = pools.filter((pool) => pool.length > round);
    if (takers.length === 0) break;
    for (const pool of takers) {
      if (picked.length < EXAM_LENGTH) picked.push(pool[round]);
    }
  }
  return shuffle(picked, rng);
}

export function examPercent(answers: readonly AnswerRecord[]): number {
  return Math.round(accuracy(answers) * 100);
}

export function gradeFor(percent: number): Grade {
  const grades = GAME_CONFIG.examGrades;
  const order = ['sehrGut', 'gut', 'befriedigend', 'ausreichend'] as const;
  return order.find((grade) => percent >= grades[grade]) ?? 'nichtBestanden';
}

/** The topics with mistakes in the test, the lowest share of right answers first. */
export function weakestTopics(answers: readonly AnswerRecord[], limit = 3): string[] {
  const byTopic = new Map<string, { right: number; total: number }>();
  for (const answer of answers) {
    const tally = byTopic.get(answer.topicId) ?? { right: 0, total: 0 };
    tally.total += 1;
    if (answer.isCorrect) tally.right += 1;
    byTopic.set(answer.topicId, tally);
  }
  return [...byTopic]
    .filter(([, t]) => t.right < t.total)
    .sort(([, a], [, b]) => a.right / a.total - b.right / b.total || b.total - a.total)
    .slice(0, limit)
    .map(([topicId]) => topicId);
}

/** Record a finished test: one more play, and the best percentage for the level. */
export function withExamResult(
  progress: Progress,
  level: Level,
  percent: number,
): { exams: NonNullable<Progress['exams']>; isBest: boolean } {
  const before = progress.exams?.[level];
  const isBest = before === undefined || percent > before.bestPercent;
  return {
    exams: {
      ...progress.exams,
      [level]: {
        plays: (before?.plays ?? 0) + 1,
        bestPercent: Math.max(percent, before?.bestPercent ?? 0),
      },
    },
    isBest,
  };
}
