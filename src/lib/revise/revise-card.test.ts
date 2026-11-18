import { describe, expect, it } from 'vitest';

import { getTopic } from '@/content';
import type { Topic } from '@/content/types';

import { buildReviseCard, correctForm, findQuestion } from './revise-card';

const topic: Topic = {
  id: 't',
  level: 'A1',
  group: 'nouns',
  title: 'T',
  tagline: '',
  rules: [],
  sort: {
    instruction: '',
    bins: ['der', 'die', 'das'],
    questions: [
      {
        id: 't-sort-1',
        kind: 'sort',
        prompt: 'Wohnung',
        gloss: 'flat',
        answer: 'die',
        explanation: '-ung is feminine.',
      },
      {
        id: 't-sort-2',
        kind: 'sort',
        prompt: 'Zeitung',
        answer: 'die',
        explanation: '-ung is feminine.',
      },
      {
        id: 't-sort-3',
        kind: 'sort',
        prompt: 'Mädchen',
        answer: 'das',
        explanation: '-chen is neuter.',
      },
      {
        id: 't-sort-4',
        kind: 'sort',
        prompt: 'Ich sehe ___ Mann.',
        answer: 'den',
        explanation: 'Akkusativ.',
      },
    ],
  },
  gap: [
    {
      id: 't-gap-1',
      kind: 'gap',
      before: 'Ich helfe ',
      after: ' Mann.',
      options: ['den', 'dem'],
      answer: 'dem',
      translation: 'I help the man.',
      explanation: 'helfen takes the dative.',
    },
  ],
  build: [
    {
      id: 't-build-1',
      kind: 'build',
      translation: 'I cook when I have time.',
      tiles: ['ich', 'koche', ',', 'wenn', 'ich', 'Zeit', 'habe'],
      accepted: [['wenn', 'ich', 'Zeit', 'habe', ',', 'koche', 'ich']],
      punctuation: '.',
      explanation: 'wenn sends the verb to the end.',
    },
  ],
};

describe('correctForm', () => {
  it('puts the article before a bare noun', () => {
    expect(correctForm(topic.sort!.questions[0])).toBe('die Wohnung');
  });

  it('fills a blank in a sort prompt', () => {
    expect(correctForm(topic.sort!.questions[3])).toBe('Ich sehe den Mann.');
  });

  it('fills a gap', () => {
    expect(correctForm(topic.gap![0])).toBe('Ich helfe dem Mann.');
  });
});

describe('buildReviseCard', () => {
  it('shows other nouns with the same article as examples', () => {
    const card = buildReviseCard(topic, topic.sort!.questions[0]);
    expect(card).toMatchObject({
      correct: 'die Wohnung',
      translation: 'flat',
      examples: ['die Zeitung'],
    });
  });

  it('lists other correct word orders for sentence builders', () => {
    const card = buildReviseCard(topic, topic.build![0]);
    expect(card.correct).toBe('Ich koche, wenn ich Zeit habe.');
    expect(card.alsoCorrect).toEqual(['Wenn ich Zeit habe, koche ich.']);
  });

  it('builds cards for real content', () => {
    const real = getTopic('noun-gender')!;
    const card = buildReviseCard(real, real.sort!.questions[0]);
    expect(card.examples.length).toBeGreaterThan(0);
  });
});

describe('findQuestion', () => {
  it('finds a question, or nothing for retired ids', () => {
    expect(findQuestion([topic], 't', 't-gap-1')?.question.id).toBe('t-gap-1');
    expect(findQuestion([topic], 't', 't-gap-99')).toBeUndefined();
    expect(findQuestion([topic], 'nope', 't-gap-1')).toBeUndefined();
  });
});

describe('correctForm for non-article sort answers', () => {
  it('shows the prompt and the category it belongs to', () => {
    expect(
      correctForm({
        id: 'x-sort-1',
        kind: 'sort',
        prompt: 'mit',
        answer: 'Dativ',
        explanation: 'mit + Dativ.',
      }),
    ).toBe('mit → Dativ');
  });
});
