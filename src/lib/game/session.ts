/**
 * Session building: which questions a game round asks, in what order.
 *
 * Questions the learner gets wrong (or hasn't seen) are weighted up, so practice
 * drifts towards weak spots without a separate review deck.
 */

import { GAME_CONFIG } from '@/config/game';
import type { GameMode, Question, QuestionMode, Topic } from '@/content/types';

import type { QuestionStats } from '../progress/types';
import { isDue } from '../revise/schedule';
import { isTypeable } from './check-typed';
import type { Rng } from './rng';

/** A question plus the context needed to render it outside its topic. */
export interface SessionItem {
  topicId: string;
  question: Question;
  /** Sort bins, present only for sort questions. */
  bins?: string[];
  instruction?: string;
  /** A gap question to be answered by typing (Type the answer mode). */
  typed?: boolean;
}

export const SESSION_LENGTH: Readonly<Record<QuestionMode, number>> = GAME_CONFIG.sessionLength;

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

export function topicItems(topic: Topic, mode: QuestionMode): SessionItem[] {
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
    case 'type':
      return (topic.gap ?? [])
        .filter(isTypeable)
        .map((question) => ({ topicId: topic.id, question, typed: true }));
    /* v8 ignore next 4 -- exhaustive: the type system proves this is unreachable */
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unknown game mode: ${String(exhaustive)}`);
    }
  }
}

/**
 * The one-question-at-a-time modes a topic has, each question once: everything but
 * grid fill, and not Type the answer, which re-asks the gap questions.
 */
export function questionModes(topic: Topic): QuestionMode[] {
  return availableModes(topic).filter(
    (mode): mode is QuestionMode => mode !== 'grid' && mode !== 'type',
  );
}

export function availableModes(topic: Topic): GameMode[] {
  const modes: GameMode[] = [];
  if (topic.sort?.questions.length) modes.push('sort');
  if (topic.gap?.length) modes.push('gap');
  if (topic.gap?.some(isTypeable)) modes.push('type');
  if (topic.build?.length) modes.push('build');
  if (topic.grids?.length) modes.push('grid');
  return modes;
}

/**
 * Build the queue for one topic and mode. Sort rounds are timed, so their queue
 * repeats the deck (in fresh weighted orders) to fill SESSION_LENGTH.
 */
export function buildTopicSession(
  topic: Topic,
  mode: QuestionMode,
  stats: Readonly<Record<string, QuestionStats>>,
  rng: Rng,
  { untimed = false }: { untimed?: boolean } = {},
): SessionItem[] {
  const pool = topicItems(topic, mode);
  if (pool.length === 0) return [];
  const weight = (item: SessionItem) => questionWeight(stats[item.question.id]);
  // Untimed Blitz is a fixed round, so each prompt comes up at most once.
  if (mode === 'sort' && untimed) {
    return pickWeighted(pool, Math.min(GAME_CONFIG.untimedSortLength, pool.length), weight, rng);
  }
  const length = SESSION_LENGTH[mode];

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
 * list come first: those due today, then the rest (most-missed first within each);
 * the rest of the round is the questions they miss most. Sort questions are included
 * with their deck's bins.
 *
 * @param revise question id → times missed and day due, from the learner's revise list
 * @param today the learner's day key; without it every revise entry counts as due
 */
/**
 * Up to `count` revise-list questions from `pool`: due ones first, then the others,
 * weighted by misses within each group.
 */
export function pickRevise(
  pool: readonly SessionItem[],
  revise: Readonly<Record<string, { misses: number; dueOn?: string }>>,
  count: number,
  rng: Rng,
  today?: string,
): SessionItem[] {
  const listed = pool.filter((item) => revise[item.question.id]);
  const due = listed.filter((item) => !today || isDue(revise[item.question.id], today));
  const later = listed.filter((item) => !due.includes(item));
  const weight = (item: SessionItem) => revise[item.question.id].misses;
  const first = pickWeighted(due, Math.min(count, due.length), weight, rng);
  const second = pickWeighted(later, Math.min(count - first.length, later.length), weight, rng);
  return [...first, ...second];
}

export function buildReviewSession(
  topics: readonly Topic[],
  startedTopicIds: ReadonlySet<string>,
  stats: Readonly<Record<string, QuestionStats>>,
  revise: Readonly<Record<string, { misses: number; dueOn?: string }>>,
  rng: Rng,
  today?: string,
): SessionItem[] {
  const pool = topics
    .filter((topic) => startedTopicIds.has(topic.id))
    .flatMap((topic) => questionModes(topic).flatMap((mode) => topicItems(topic, mode)));

  const picked = pickRevise(pool, revise, REVIEW_LENGTH, rng, today);
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
