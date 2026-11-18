import { describe, expect, it } from 'vitest';

import type { Topic } from '@/content/types';

import { createRng, shuffle } from './rng';
import {
  SESSION_LENGTH,
  availableModes,
  buildReviewSession,
  buildTopicSession,
  pickWeighted,
  questionWeight,
} from './session';

function makeTopic(id: string, sortCount: number, gapCount: number): Topic {
  return {
    id,
    level: 'A1',
    group: 'nouns',
    title: id,
    tagline: '',
    rules: [],
    sort: {
      instruction: 'Sort',
      bins: ['a', 'b'],
      questions: Array.from({ length: sortCount }, (_, i) => ({
        id: `${id}-sort-${i + 1}`,
        kind: 'sort' as const,
        prompt: `p${i}`,
        answer: 'a',
        explanation: '',
      })),
    },
    gap: Array.from({ length: gapCount }, (_, i) => ({
      id: `${id}-gap-${i + 1}`,
      kind: 'gap' as const,
      before: '',
      after: '',
      options: ['x', 'y'],
      answer: 'x',
      translation: '',
      explanation: '',
    })),
  };
}

describe('rng', () => {
  it('is deterministic for a seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('shuffles without losing items', () => {
    const items = [1, 2, 3, 4, 5, 6];
    expect(shuffle(items, createRng(1)).sort()).toEqual(items);
  });
});

describe('questionWeight', () => {
  it('prefers unseen and missed questions', () => {
    const unseen = questionWeight(undefined);
    const alwaysRight = questionWeight({ seen: 5, correct: 5 });
    const alwaysWrong = questionWeight({ seen: 5, correct: 0 });
    expect(alwaysWrong).toBeGreaterThan(unseen);
    expect(unseen).toBeGreaterThan(alwaysRight);
  });
});

describe('pickWeighted', () => {
  it('returns distinct items up to the count', () => {
    const picked = pickWeighted([1, 2, 3, 4, 5], 3, () => 1, createRng(3));
    expect(new Set(picked).size).toBe(3);
  });

  it('strongly favours heavy items', () => {
    let heavyFirst = 0;
    for (let seed = 0; seed < 200; seed++) {
      const [first] = pickWeighted(
        ['light', 'heavy'],
        1,
        (x) => (x === 'heavy' ? 50 : 1),
        createRng(seed),
      );
      if (first === 'heavy') heavyFirst++;
    }
    expect(heavyFirst).toBeGreaterThan(170);
  });
});

describe('buildTopicSession', () => {
  it('caps gap sessions at the session length', () => {
    const topic = makeTopic('t', 5, 25);
    expect(buildTopicSession(topic, 'gap', {}, createRng(1))).toHaveLength(SESSION_LENGTH.gap);
  });

  it('uses every question when the bank is smaller than a session', () => {
    const topic = makeTopic('t', 5, 4);
    expect(buildTopicSession(topic, 'gap', {}, createRng(1))).toHaveLength(4);
  });

  it('fills a sort queue by repeating the deck, attaching bins', () => {
    const topic = makeTopic('t', 7, 0);
    const queue = buildTopicSession(topic, 'sort', {}, createRng(1));
    expect(queue).toHaveLength(SESSION_LENGTH.sort);
    expect(queue.every((item) => item.bins?.join() === 'a,b')).toBe(true);
    for (let i = 1; i < queue.length; i++) {
      expect(queue[i].question.id).not.toBe(queue[i - 1].question.id);
    }
  });

  it('returns nothing for a mode the topic lacks', () => {
    expect(buildTopicSession(makeTopic('t', 3, 3), 'build', {}, createRng(1))).toEqual([]);
  });
});

describe('availableModes', () => {
  it('lists only modes with questions', () => {
    expect(availableModes(makeTopic('t', 3, 0))).toEqual(['sort']);
  });
});

describe('buildReviewSession', () => {
  it('only draws from started topics and prefers missed questions', () => {
    const started = makeTopic('started', 10, 10);
    const untouched = makeTopic('untouched', 10, 10);
    const stats: Record<string, { seen: number; correct: number }> = {};
    for (const q of [...started.sort!.questions, ...started.gap!])
      stats[q.id] = { seen: 4, correct: 4 };
    stats['started-gap-3'] = { seen: 4, correct: 0 };

    let missedIncluded = 0;
    for (let seed = 0; seed < 50; seed++) {
      const session = buildReviewSession(
        [started, untouched],
        new Set(['started']),
        stats,
        {},
        createRng(seed),
      );
      expect(session.every((item) => item.topicId === 'started')).toBe(true);
      if (session.some((item) => item.question.id === 'started-gap-3')) missedIncluded++;
    }
    expect(missedIncluded).toBeGreaterThan(40);
  });

  it('puts every to-revise question in the round before anything else', () => {
    const started = makeTopic('started', 10, 10);
    const revise = { 'started-gap-2': { misses: 1 }, 'started-sort-4': { misses: 3 } };
    const session = buildReviewSession([started], new Set(['started']), {}, revise, createRng(7));
    expect(session).toHaveLength(12);
    expect(
      session
        .slice(0, 2)
        .map((item) => item.question.id)
        .sort(),
    ).toEqual(['started-gap-2', 'started-sort-4']);
    expect(new Set(session.map((item) => item.question.id)).size).toBe(12);
  });
});
