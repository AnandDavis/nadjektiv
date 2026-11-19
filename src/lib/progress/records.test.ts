import { describe, expect, it } from 'vitest';

import { fastestGridMs, personalRecords } from './records';
import { createEmptyProgress, createEmptyTopicProgress, type ModeBest } from './types';

const best = (bestScore: number, bestCombo: number): ModeBest => ({
  plays: 1,
  bestScore,
  bestAccuracy: 0.9,
  bestCombo,
});

describe('personalRecords', () => {
  it('is empty before anything is played', () => {
    expect(personalRecords(createEmptyProgress(), ['a'], ['g'])).toEqual({ topics: [], grids: [] });
  });

  it('collects bests per topic and picks the headline records', () => {
    const progress = createEmptyProgress();
    progress.topics.a = {
      ...createEmptyTopicProgress(),
      modes: { sort: best(300, 12), gap: best(90, 9) },
    };
    progress.topics.b = {
      ...createEmptyTopicProgress(),
      modes: { sort: best(450, 4), sortUntimed: best(999, 20) },
    };
    progress.grids.g1 = { plays: 2, bestCells: 12, bestTimeMs: 61_000 };
    progress.grids.g2 = { plays: 1, bestCells: 5 };
    progress.grids.g3 = { plays: 1, bestCells: 16, bestTimeMs: 48_000 };

    const records = personalRecords(progress, ['a', 'b', 'c'], ['g1', 'g2', 'g3', 'g4']);
    // Untimed Blitz scores aren't comparable with timed ones, so they don't count here.
    expect(records.bestBlitz).toEqual({ topicId: 'b', score: 450 });
    expect(records.longestCombo).toEqual({ topicId: 'b', mode: 'sortUntimed', combo: 20 });
    expect(records.fastestGrid).toEqual({ gridId: 'g3', timeMs: 48_000 });
    expect(records.topics.map((t) => [t.topicId, t.modes.map((m) => m.mode)])).toEqual([
      ['a', ['sort', 'gap']],
      ['b', ['sort', 'sortUntimed']],
    ]);
    expect(records.grids.map((g) => g.gridId)).toEqual(['g1', 'g2', 'g3']);
  });
});

describe('fastestGridMs', () => {
  it('picks the fastest finished table of the topic only', () => {
    const progress = createEmptyProgress();
    progress.grids['articles-grid-1'] = { plays: 1, bestCells: 16, bestTimeMs: 61_000 };
    progress.grids['articles-grid-2'] = { plays: 1, bestCells: 16, bestTimeMs: 48_000 };
    progress.grids['articles-grid-3'] = { plays: 1, bestCells: 5 };
    progress.grids['pronouns-grid-1'] = { plays: 1, bestCells: 9, bestTimeMs: 20_000 };
    expect(fastestGridMs(progress, 'articles')).toBe(48_000);
  });

  it('is undefined when no table of the topic was finished', () => {
    const progress = createEmptyProgress();
    progress.grids['articles-grid-1'] = { plays: 1, bestCells: 5 };
    expect(fastestGridMs(progress, 'articles')).toBeUndefined();
  });
});
