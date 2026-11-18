import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';

import { reviseCount, reviseList } from './revise-list';

const entry = (topicId: string, misses: number, lastMissedAt: string) => ({
  topicId,
  given: 'x',
  misses,
  lastMissedAt,
});

describe('reviseList', () => {
  it('puts the most-missed first across topics, then the most recent, skipping retired ids', () => {
    const list = reviseList(TOPICS, {
      'articles-gap-1': entry('articles', 1, '2026-11-18T10:00:00Z'),
      'noun-gender-sort-1': entry('noun-gender', 2, '2026-11-18T08:00:00Z'),
      'articles-gap-2': entry('articles', 3, '2026-11-18T09:00:00Z'),
      'plurals-gap-1': entry('plurals', 1, '2026-11-18T11:00:00Z'),
      'articles-gap-9999': entry('articles', 5, '2026-11-18T11:00:00Z'),
    });
    expect(list.map((i) => i.card.questionId)).toEqual([
      'articles-gap-2',
      'noun-gender-sort-1',
      'plurals-gap-1',
      'articles-gap-1',
    ]);
  });
});

describe('reviseCount', () => {
  it('counts the entries on the list', () => {
    expect(reviseCount({})).toBe(0);
    expect(reviseCount({ a: entry('articles', 1, '2026-11-18T10:00:00Z') })).toBe(1);
  });
});
