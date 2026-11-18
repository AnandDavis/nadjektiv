import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';

import { reviseCount, reviseGroups } from './revise-groups';

const entry = (topicId: string, misses: number, lastMissedAt: string) => ({
  topicId,
  given: 'x',
  misses,
  lastMissedAt,
});

describe('reviseGroups', () => {
  it('groups by topic in learning order, most-missed first, skipping retired ids', () => {
    const groups = reviseGroups(TOPICS, {
      'articles-gap-1': entry('articles', 1, '2026-11-18T10:00:00Z'),
      'noun-gender-sort-1': entry('noun-gender', 1, '2026-11-18T10:00:00Z'),
      'articles-gap-2': entry('articles', 3, '2026-11-18T09:00:00Z'),
      'articles-gap-9999': entry('articles', 5, '2026-11-18T11:00:00Z'),
    });
    expect(groups.map((g) => g.topicId)).toEqual(['noun-gender', 'articles']);
    expect(groups[1].items.map((i) => i.card.questionId)).toEqual([
      'articles-gap-2',
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
