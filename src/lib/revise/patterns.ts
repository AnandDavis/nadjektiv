/**
 * Mistake patterns: revise entries grouped by the rule behind them, so a learner sees
 * "den instead of dem, 5 times" rather than five separate cards. A pattern is a topic
 * plus the wrong choice and the right answer (gap and sort questions; a built sentence
 * has no single choice to group by).
 */

import type { Topic } from '@/content/types';

import type { ReviseEntry } from '../progress/types';
import { findQuestion } from './revise-card';

export interface MistakePattern {
  topicId: string;
  given: string;
  answer: string;
  /** Total misses across the questions in the pattern. */
  misses: number;
  /** How many different questions share it. */
  questions: number;
}

const MIN_MISSES = 2;

export function mistakePatterns(
  topics: readonly Topic[],
  revise: Readonly<Record<string, ReviseEntry>>,
  limit = 3,
): MistakePattern[] {
  const byKey = new Map<string, MistakePattern>();
  for (const [questionId, entry] of Object.entries(revise)) {
    const found = findQuestion(topics, entry.topicId, questionId);
    if (!found || found.question.kind === 'build') continue;
    const given = entry.given.trim().toLowerCase();
    const answer = found.question.answer.trim().toLowerCase();
    if (!given || given === answer) continue;
    const key = `${entry.topicId}|${given}|${answer}`;
    const pattern = byKey.get(key) ?? {
      topicId: entry.topicId,
      given,
      answer,
      misses: 0,
      questions: 0,
    };
    pattern.misses += entry.misses;
    pattern.questions += 1;
    byKey.set(key, pattern);
  }
  return [...byKey.values()]
    .filter((p) => p.misses >= MIN_MISSES)
    .sort((a, b) => b.misses - a.misses || b.questions - a.questions)
    .slice(0, limit);
}
