import { describe, expect, it } from 'vitest';

import { ProgressParseError, parseProgress } from './migrate';
import { PROGRESS_VERSION, createEmptyProgress } from './types';

describe('parseProgress', () => {
  it('accepts current progress unchanged', () => {
    const progress = { ...createEmptyProgress(), xp: 30 };
    expect(parseProgress(progress)).toEqual(progress);
  });

  it('migrates version 1 progress, keeping everything and adding an empty revise list', () => {
    const v1 = {
      version: 1,
      xp: 120,
      topics: { articles: { answered: 10, correct: 7, recent: [1, 0, 1], modes: {} } },
      questions: { 'articles-gap-1': { seen: 2, correct: 1 } },
      startedAt: '2026-11-18T10:00:00.000Z',
    };
    expect(parseProgress(v1)).toEqual({ ...v1, version: PROGRESS_VERSION, revise: {}, grids: {} });
  });

  it('rejects data that is not progress', () => {
    expect(() => parseProgress('nope')).toThrow(ProgressParseError);
    expect(() => parseProgress({ version: 2, xp: -1 })).toThrow(ProgressParseError);
  });
});

describe('parseProgress without a version', () => {
  it('rejects data that has no version number', () => {
    expect(() => parseProgress({ xp: 1, topics: {}, questions: {}, revise: {} })).toThrow(
      ProgressParseError,
    );
  });
});

describe('parseProgress from version 2', () => {
  it('keeps the revise list and adds empty grid bests', () => {
    const v2 = {
      version: 2,
      xp: 40,
      topics: {},
      questions: {},
      revise: {
        'articles-gap-1': {
          topicId: 'articles',
          given: 'dem',
          misses: 1,
          lastMissedAt: '2026-11-18T10:00:00Z',
        },
      },
    };
    expect(parseProgress(v2)).toEqual({ ...v2, version: PROGRESS_VERSION, grids: {} });
  });
});
