/**
 * The daily mix: a short ready-made round, the same all day. Up to half comes from
 * the revise list, the rest from the learner's weakest topics. The day's date seeds
 * every choice, so reopening it gives the same questions until midnight. There is
 * no streak: missing a day costs nothing.
 */

import { GAME_CONFIG } from '@/config/game';
import type { Topic } from '@/content/types';
import { hashString } from '@/lib/utils/hash';
import { recentAccuracy } from '@/lib/progress/mastery';
import type { Progress } from '@/lib/progress/types';

import { createRng, shuffle, type Rng } from './rng';
import {
  pickWeighted,
  questionModes,
  questionWeight,
  topicItems,
  type SessionItem,
} from './session';

export const DAILY_LENGTH = GAME_CONFIG.dailyLength;
/** How many of the weakest started topics the mix draws from. */
const WEAK_TOPICS = 3;
/** With nothing played yet, the mix comes from the first topics of the syllabus. */
const STARTER_TOPICS = 3;

/** The learner's own calendar day, "2026-11-18": the mix changes at local midnight. */
export function dailyKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

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
  const toRevise = pool.filter((item) => progress.revise[item.question.id]);
  const picked = take(
    toRevise,
    Math.ceil(DAILY_LENGTH / 2),
    (item) => progress.revise[item.question.id].misses,
    rng,
  );

  const weakest = [...started]
    .sort(
      (a, b) =>
        recentAccuracy(progress.topics[a.id]) - recentAccuracy(progress.topics[b.id]) ||
        progress.topics[a.id].answered - progress.topics[b.id].answered,
    )
    .slice(0, WEAK_TOPICS);
  const chosen = new Set(picked);
  const weakPool = poolOf(weakest).filter(
    (item) => !picked.some((p) => p.question.id === item.question.id),
  );
  const weight = (item: SessionItem) => questionWeight(stats[item.question.id]);
  for (const item of take(weakPool, DAILY_LENGTH - picked.length, weight, rng)) chosen.add(item);

  // A small syllabus or few weak questions: top up from everything started.
  if (chosen.size < DAILY_LENGTH) {
    const ids = new Set([...chosen].map((item) => item.question.id));
    const rest = pool.filter((item) => !ids.has(item.question.id));
    for (const item of take(rest, DAILY_LENGTH - chosen.size, weight, rng)) chosen.add(item);
  }
  return shuffle([...chosen], rng);
}
