import { describe, expect, it } from 'vitest';

import type { BuildQuestion } from '@/content/types';

import { formatSentence, isCorrectOrder, matchingOrder } from './check-answer';

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

describe('commas', () => {
  const clause: BuildQuestion = {
    id: 't-build-2',
    kind: 'build',
    translation: 'I cook when I have time.',
    tiles: ['ich', 'koche', ',', 'wenn', 'ich', 'Zeit', 'habe'],
    accepted: [['wenn', 'ich', 'Zeit', 'habe', ',', 'koche', 'ich']],
    punctuation: '.',
    explanation: 'The wenn-clause can come first or second.',
  };

  it('accepts either clause order without the learner placing commas', () => {
    expect(isCorrectOrder(clause, ['ich', 'koche', 'wenn', 'ich', 'Zeit', 'habe'])).toBe(true);
    expect(isCorrectOrder(clause, ['wenn', 'ich', 'Zeit', 'habe', 'koche', 'ich'])).toBe(true);
    expect(isCorrectOrder(clause, ['wenn', 'ich', 'habe', 'Zeit', 'koche', 'ich'])).toBe(false);
  });

  it('returns the matched order so the sentence shows its commas', () => {
    const matched = matchingOrder(clause, ['wenn', 'ich', 'Zeit', 'habe', 'koche', 'ich']);
    expect(formatSentence(matched!, '.')).toBe('Wenn ich Zeit habe, koche ich.');
  });
});
