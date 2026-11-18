import { describe, expect, it } from 'vitest';

import type { BuildQuestion } from '@/content/types';

import { formatSentence, isCorrectOrder } from './check-answer';

const question: BuildQuestion = {
  id: 't-build-1',
  kind: 'build',
  translation: 'I am going to the cinema today.',
  tiles: ['ich', 'gehe', 'heute', 'ins Kino'],
  accepted: [['heute', 'gehe', 'ich', 'ins Kino']],
  punctuation: '.',
  explanation: 'Verb second.',
};

describe('isCorrectOrder', () => {
  it('accepts the canonical order', () => {
    expect(isCorrectOrder(question, ['ich', 'gehe', 'heute', 'ins Kino'])).toBe(true);
  });

  it('accepts a listed alternative', () => {
    expect(isCorrectOrder(question, ['heute', 'gehe', 'ich', 'ins Kino'])).toBe(true);
  });

  it('rejects other orders', () => {
    expect(isCorrectOrder(question, ['heute', 'ich', 'gehe', 'ins Kino'])).toBe(false);
  });

  it('rejects incomplete answers', () => {
    expect(isCorrectOrder(question, ['ich', 'gehe', 'heute'])).toBe(false);
  });

  it('ignores case and extra whitespace', () => {
    expect(isCorrectOrder(question, ['Ich', 'gehe ', 'heute', 'ins  Kino'])).toBe(true);
  });
});

describe('formatSentence', () => {
  it('capitalises the first word and adds punctuation', () => {
    expect(formatSentence(['heute', 'gehe', 'ich', 'ins Kino'], '.')).toBe(
      'Heute gehe ich ins Kino.',
    );
  });

  it('returns an empty string for no tiles', () => {
    expect(formatSentence([], '?')).toBe('');
  });
});
