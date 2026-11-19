import { describe, expect, it } from 'vitest';

import { summariseProgress } from './summary';
import { createEmptyProgress } from './types';

describe('summariseProgress', () => {
  it('handles a fresh learner', () => {
    const summary = summariseProgress(createEmptyProgress(), [{ id: 'a', modes: ['gap'] }]);
    expect(summary).toEqual({
      answered: 0,
      accuracy: 0,
      started: 0,
      toRevise: 0,
      tierCounts: { new: 1, bronze: 0, silver: 0, gold: 0, mastered: 0 },
    });
  });

  it('totals answers and tiers across topics', () => {
    const progress = createEmptyProgress();
    progress.topics.a = { answered: 10, correct: 8, recent: Array(10).fill(1), modes: {} };
    progress.topics.b = { answered: 2, correct: 0, recent: [0, 0], modes: {} };
    const miss = { topicId: 'b', given: 'der', misses: 1, lastMissedAt: '2026-11-19T09:00Z' };
    progress.revise = { q1: miss, q2: miss };
    const summary = summariseProgress(progress, [
      { id: 'a', modes: ['gap'] },
      { id: 'b', modes: ['gap'] },
    ]);
    expect(summary.answered).toBe(12);
    expect(summary.accuracy).toBeCloseTo(8 / 12);
    expect(summary.started).toBe(2);
    expect(summary.toRevise).toBe(2);
    expect(summary.tierCounts.bronze).toBe(1);
    expect(summary.tierCounts.new).toBe(1);
  });
});
