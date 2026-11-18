/**
 * The daily mix: a short ready-made round, the same all day. Up to half comes from
 * the revise list (entries due today first), the rest from the learner's weakest
 * topics. The day's date seeds every choice, so reopening it gives the same questions
 * until midnight. There is no streak: missing a day costs nothing.
 */

import { GAME_CONFIG } from '@/config/game';
import type { Topic } from '@/content/types';
import { hashString } from '@/lib/utils/hash';
import { recentAccuracy } from '@/lib/progress/mastery';
import type { Progress } from '@/lib/progress/types';

import { createRng, shuffle, type Rng } from './rng';
import {
  pickRevise,
  pickWeighted,
  questionModes,
  questionWeight,
  topicItems,
  type SessionItem,
} from './session';

export const DAILY_LENGTH = GAME_CONFIG.dailyLength;
const WEAK_TOPICS = GAME_CONFIG.dailyWeakTopics;
const STARTER_TOPICS = GAME_CONFIG.dailyStarterTopics;
const BREAK_BOOST = GAME_CONFIG.dailyBreakBoost;

/** "two-way-prepositions-gap" for "two-way-prepositions-gap-7": the question's topic and game. */
export function questionGroup(questionId: string): string {
  return questionId.replace(/-\d+$/, '');
}

/** The learner's own calendar day, "2026-11-18": the mix changes at local midnight. */
export { dailyKey } from '@/lib/utils/day';

export function isDailyDone(progress: Progress, key: string): boolean {
  return progress.daily?.lastDone === key;
}

function poolOf(topics: readonly Topic[]): SessionItem[] {
  return topics.flatMap((topic) => questionModes(topic).flatMap((mode) => topicItems(topic, mode)));
}

function take(
  items: readonly SessionItem[],
  count: number,
  weight: (i: SessionItem) => number,
  rng: Rng,
) {
  return pickWeighted(items, Math.min(count, items.length), weight, rng);
}

export function buildDailySession(
  topics: readonly Topic[],
  progress: Progress,
  key: string,
): SessionItem[] {
  const rng = createRng(Number.parseInt(hashString(`daily:${key}`), 36));
  const started = topics.filter((topic) => progress.topics[topic.id]);
  if (started.length === 0) {
    return take(poolOf(topics.slice(0, STARTER_TOPICS)), DAILY_LENGTH, () => 1, rng);
  }

  const pool = poolOf(started);
  const stats = progress.questions;
  // Revise entries due today come first, then the others.
  const picked = pickRevise(pool, progress.revise, Math.ceil(DAILY_LENGTH / 2), rng, key);

  // Where a long run broke is a clue to a rule that isn't solid yet: those topics come
  // first, and questions from the same topic and game weigh more.
  const breaks = progress.comboBreaks ?? [];
  const breakGroups = new Set(breaks.map((b) => questionGroup(b.questionId)));
  const breakTopics = new Set(
    pool.filter((item) => breakGroups.has(questionGroup(item.question.id))).map((i) => i.topicId),
  );
  const byWeakness = [...started].sort(
    (a, b) =>
      recentAccuracy(progress.topics[a.id]) - recentAccuracy(progress.topics[b.id]) ||
      progress.topics[a.id].answered - progress.topics[b.id].answered,
  );
  const weakest = [
    ...byWeakness.filter((t) => breakTopics.has(t.id)),
    ...byWeakness.filter((t) => !breakTopics.has(t.id)),
  ].slice(0, WEAK_TOPICS);
  const chosen = new Set(picked);
  const weakPool = poolOf(weakest).filter(
    (item) => !picked.some((p) => p.question.id === item.question.id),
  );
  const weight = (item: SessionItem) =>
    questionWeight(stats[item.question.id]) *
    (breakGroups.has(questionGroup(item.question.id)) ? BREAK_BOOST : 1);
  for (const item of take(weakPool, DAILY_LENGTH - picked.length, weight, rng)) chosen.add(item);

  // A small syllabus or few weak questions: top up from everything started.
  if (chosen.size < DAILY_LENGTH) {
    const ids = new Set([...chosen].map((item) => item.question.id));
    const rest = pool.filter((item) => !ids.has(item.question.id));
    for (const item of take(rest, DAILY_LENGTH - chosen.size, weight, rng)) chosen.add(item);
  }
  return shuffle([...chosen], rng);
}

/**
 * Today's mix: the one saved when it was first built today, or a new one. Reopening
 * gives the same questions even after playing changes the learner's stats; a saved
 * question that has since been retired is simply left out.
 */
export function todaysMix(
  topics: readonly Topic[],
  progress: Progress,
  key: string,
): { items: SessionItem[]; isNew: boolean } {
  if (progress.dailyMix?.day === key) {
    const byId = new Map(poolOf(topics).map((item) => [item.question.id, item]));
    const items = progress.dailyMix.ids.flatMap((id) => byId.get(id) ?? []);
    if (items.length > 0) return { items, isNew: false };
  }
  return { items: buildDailySession(topics, progress, key), isNew: true };
}

/** Remember today's mix in progress, so the same questions come back all day. */
export function withDailyMix(
  progress: Progress,
  key: string,
  items: readonly SessionItem[],
): Progress {
  return { ...progress, dailyMix: { day: key, ids: items.map((item) => item.question.id) } };
}
