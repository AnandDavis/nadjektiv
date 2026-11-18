import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';

import { mistakePatterns } from './patterns';

const articles = TOPICS.find((t) => t.id === 'articles')!;
const entry = (topicId: string, given: string, misses = 1) => ({
  topicId,
  given,
  misses,
  lastMissedAt: '2026-11-18T10:00Z',
});

describe('mistakePatterns', () => {
  it('groups misses by topic, wrong choice and right answer, biggest first', () => {
    const dative = (articles.gap ?? []).filter((q) => q.answer === 'meinem').slice(0, 2);
    expect(dative).toHaveLength(2);
    const other = (articles.gap ?? []).find((q) => q.answer !== 'meinem')!;
    const wrong = other.options.find((o) => o !== other.answer)!;
    const patterns = mistakePatterns(TOPICS, {
      [dative[0].id]: entry('articles', 'meinen', 2),
      [dative[1].id]: entry('articles', 'Meinen'),
      [other.id]: entry('articles', wrong, 2),
    });
    expect(patterns[0]).toEqual({
      topicId: 'articles',
      given: 'meinen',
      answer: 'meinem',
      misses: 3,
      questions: 2,
    });
    expect(patterns[1]).toMatchObject({ given: wrong.toLowerCase(), misses: 2, questions: 1 });
  });

  it('ignores one-off slips, built sentences and retired questions', () => {
    const build = TOPICS.find((t) => t.build?.length)!;
    const gap = (articles.gap ?? [])[0];
    expect(
      mistakePatterns(TOPICS, {
        [gap.id]: entry(
          'articles',
          gap.options.find((o) => o !== gap.answer)!,
        ),
        [build.build![0].id]: entry(build.id, 'any order', 5),
        'articles-gap-9999': entry('articles', 'x', 5),
      }),
    ).toEqual([]);
  });
});
