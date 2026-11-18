/**
 * Session building: which questions a game round asks, in what order.
 *
 * Questions the learner gets wrong (or hasn't seen) are weighted up, so practice
 * drifts towards weak spots without a separate review deck.
 */

import { GAME_CONFIG } from '@/config/game';
import type { GameMode, Question, Topic } from '@/content/types';

import type { QuestionStats } from '../progress/types';
import type { Rng } from './rng';

/** A question plus the context needed to render it outside its topic. */
export interface SessionItem {
  topicId: string;
  question: Question;
  /** Sort bins, present only for sort questions. */
  bins?: string[];
  instruction?: string;
}

export const SESSION_LENGTH: Readonly<Record<GameMode, number>> = GAME_CONFIG.sessionLength;

export const SORT_ROUND_SECONDS = GAME_CONFIG.sortRoundSeconds;

export const REVIEW_LENGTH = GAME_CONFIG.reviewLength;

const UNSEEN_WEIGHT = 3;
const MIN_WEIGHT = 1;
const MISS_WEIGHT = 5;

/** Higher weight = more likely to be picked. Unseen and often-missed questions come first. */
export function questionWeight(stats: QuestionStats | undefined): number {
  if (!stats || stats.seen === 0) return UNSEEN_WEIGHT;
  const missRate = 1 - stats.correct / stats.seen;
  return MIN_WEIGHT + MISS_WEIGHT * missRate;
}

/**
 * Weighted sampling without replacement (Efraimidis–Spirakis): each item gets the
 * key rng^(1/weight) and the largest keys win.
 */
export function pickWeighted<T>(
  items: readonly T[],
  count: number,
  weightOf: (item: T) => number,
  rng: Rng,
): T[] {
  return items
    .map((item) => ({ item, key: Math.pow(rng(), 1 / Math.max(weightOf(item), 0.0001)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map(({ item }) => item);
}

export function topicItems(topic: Topic, mode: GameMode): SessionItem[] {
  switch (mode) {
    case 'sort':
      return (topic.sort?.questions ?? []).map((question) => ({
        topicId: topic.id,
        question,
        bins: topic.sort?.bins,
        instruction: topic.sort?.instruction,
      }));
    case 'gap':
      return (topic.gap ?? []).map((question) => ({ topicId: topic.id, question }));
    case 'build':
      return (topic.build ?? []).map((question) => ({ topicId: topic.id, question }));
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unknown game mode: ${String(exhaustive)}`);
    }
  }
}

export function availableModes(topic: Topic): GameMode[] {
  const modes: GameMode[] = [];
  if (topic.sort?.questions.length) modes.push('sort');
  if (topic.gap?.length) modes.push('gap');
  if (topic.build?.length) modes.push('build');
  return modes;
}

/**
 * Build the queue for one topic and mode. Sort rounds are timed, so their queue
 * repeats the deck (in fresh weighted orders) to fill SESSION_LENGTH.
 */
export function buildTopicSession(
  topic: Topic,
  mode: GameMode,
  stats: Readonly<Record<string, QuestionStats>>,
  rng: Rng,
): SessionItem[] {
  const pool = topicItems(topic, mode);
  if (pool.length === 0) return [];
  const length = SESSION_LENGTH[mode];
  const weight = (item: SessionItem) => questionWeight(stats[item.question.id]);

  if (mode !== 'sort') return pickWeighted(pool, Math.min(length, pool.length), weight, rng);

  const queue: SessionItem[] = [];
  while (queue.length < length) {
    const pass = pickWeighted(pool, pool.length, weight, rng);
    // Avoid the same prompt twice in a row across pass boundaries.
    if (queue.length > 0 && pass[0] === queue[queue.length - 1] && pass.length > 1) {
      [pass[0], pass[1]] = [pass[1], pass[0]];
    }
    queue.push(...pass);
  }
  return queue.slice(0, length);
}

/**
 * Mixed review across topics the learner has started. Questions on the "to revise"
 * list come first (most-missed first); the rest of the round is the questions they
 * miss most. Sort questions are included with their deck's bins.
 *
 * @param revise question id → times missed, from the learner's revise list
 */
export function buildReviewSession(
  topics: readonly Topic[],
  startedTopicIds: ReadonlySet<string>,
  stats: Readonly<Record<string, QuestionStats>>,
  revise: Readonly<Record<string, { misses: number }>>,
  rng: Rng,
): SessionItem[] {
  const pool = topics
    .filter((topic) => startedTopicIds.has(topic.id))
    .flatMap((topic) => availableModes(topic).flatMap((mode) => topicItems(topic, mode)));

  const toRevise = pool.filter((item) => revise[item.question.id]);
  const picked = pickWeighted(
    toRevise,
    Math.min(REVIEW_LENGTH, toRevise.length),
    (item) => revise[item.question.id].misses,
    rng,
  );
  if (picked.length >= REVIEW_LENGTH) return picked;

  const rest = pool.filter((item) => !revise[item.question.id]);
  const seenRest = rest.filter((item) => (stats[item.question.id]?.seen ?? 0) > 0);
  const source = seenRest.length >= REVIEW_LENGTH - picked.length ? seenRest : rest;
  const filler = pickWeighted(
    source,
    Math.min(REVIEW_LENGTH - picked.length, source.length),
    (item) => {
      const s = stats[item.question.id];
      // In review, unseen questions are the lowest priority rather than the highest.
      return s && s.seen > 0 ? questionWeight(s) : MIN_WEIGHT / 2;
    },
    rng,
  );
  return [...picked, ...filler];
}
