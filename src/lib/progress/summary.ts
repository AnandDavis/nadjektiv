import type { GameMode } from '@/content/types';

import { TIERS, masteryFor, type Tier } from './mastery';
import type { Progress } from './types';

export interface ProgressSummary {
  answered: number;
  /** 0–1 over all answers ever given. */
  accuracy: number;
  started: number;
  tierCounts: Record<Tier, number>;
}

/** Totals for the progress page, computed in one pass over the topics. */
export function summariseProgress(
  progress: Progress,
  topics: ReadonlyArray<{ id: string; modes: readonly GameMode[] }>,
): ProgressSummary {
  const tierCounts = Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<Tier, number>;
  let answered = 0;
  let correct = 0;
  let started = 0;
  for (const topic of topics) {
    const tp = progress.topics[topic.id];
    if (tp) {
      started += 1;
      answered += tp.answered;
      correct += tp.correct;
    }
    tierCounts[masteryFor(tp, topic.modes).tier] += 1;
  }
  return { answered, accuracy: answered > 0 ? correct / answered : 0, started, tierCounts };
}
