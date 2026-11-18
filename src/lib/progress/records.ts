/**
 * Personal records, gathered from the bests progress already keeps: per topic and mode
 * (score, accuracy, combo) and per grid table (most cells, fastest time). The headline
 * records are the best of those across the whole app.
 */

import type { GridBest, ModeBest, Progress } from './types';

/** Mode keys bests are stored under, in the order the records page lists them. */
export const RECORD_MODES = ['sort', 'sortUntimed', 'gap', 'type', 'build'] as const;
export type RecordMode = (typeof RECORD_MODES)[number];

export interface TopicRecords {
  topicId: string;
  modes: Array<{ mode: RecordMode; best: ModeBest }>;
}

export interface Records {
  bestBlitz?: { topicId: string; score: number };
  longestCombo?: { topicId: string; mode: RecordMode; combo: number };
  fastestGrid?: { gridId: string; timeMs: number };
  /** Topics with at least one best, in the order given. */
  topics: TopicRecords[];
  /** Grid tables played, in the order given. */
  grids: Array<{ gridId: string; best: GridBest }>;
}

export function personalRecords(
  progress: Progress,
  topicIds: readonly string[],
  gridIds: readonly string[],
): Records {
  const records: Records = { topics: [], grids: [] };
  for (const topicId of topicIds) {
    const modes = RECORD_MODES.flatMap((mode) => {
      const best = progress.topics[topicId]?.modes[mode];
      return best ? [{ mode, best }] : [];
    });
    if (modes.length === 0) continue;
    records.topics.push({ topicId, modes });
    for (const { mode, best } of modes) {
      if (mode === 'sort' && best.bestScore > (records.bestBlitz?.score ?? 0)) {
        records.bestBlitz = { topicId, score: best.bestScore };
      }
      if (best.bestCombo > (records.longestCombo?.combo ?? 0)) {
        records.longestCombo = { topicId, mode, combo: best.bestCombo };
      }
    }
  }
  for (const gridId of gridIds) {
    const best = progress.grids[gridId];
    if (!best) continue;
    records.grids.push({ gridId, best });
    if (
      best.bestTimeMs !== undefined &&
      best.bestTimeMs < (records.fastestGrid?.timeMs ?? Infinity)
    ) {
      records.fastestGrid = { gridId, timeMs: best.bestTimeMs };
    }
  }
  return records;
}
