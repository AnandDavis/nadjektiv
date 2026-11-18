import { describe, expect, it } from 'vitest';

import { clearReviseList } from './clear-revise';
import { createEmptyProgress } from './types';

describe('clearReviseList', () => {
  it('empties the revise list and keeps everything else', () => {
    const progress = {
      ...createEmptyProgress(),
      xp: 120,
      questions: { q: { seen: 2, correct: 1 } },
      revise: { q: { topicId: 't', given: 'x', misses: 1, lastMissedAt: '2026-11-18T10:00Z' } },
    };
    const cleared = clearReviseList(progress);
    expect(cleared.revise).toEqual({});
    expect(cleared.xp).toBe(120);
    expect(cleared.questions).toBe(progress.questions);
  });
});
