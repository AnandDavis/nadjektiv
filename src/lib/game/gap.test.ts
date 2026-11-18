import { describe, expect, it } from 'vitest';

import type { GapQuestion } from '@/content/types';

import { capitaliseFirst, isEndingGap, startsSentence } from './gap';

const gap = (before: string): GapQuestion => ({
  id: 'g',
  kind: 'gap',
  before,
  after: '',
  options: ['a'],
  answer: 'a',
  translation: '',
  explanation: '',
});

describe('isEndingGap', () => {
  it('is an ending when the gap is glued to the word before it', () => {
    expect(isEndingGap(gap('Das ist ein gut'))).toBe(true);
    expect(isEndingGap(gap('Das ist '))).toBe(false);
    expect(isEndingGap(gap(''))).toBe(false);
  });
});

describe('startsSentence', () => {
  it('is true with nothing before the gap, or after a finished sentence', () => {
    expect(startsSentence(gap(''))).toBe(true);
    expect(startsSentence(gap('Er hat Fieber. '))).toBe(true);
    expect(startsSentence(gap('Wo bist du? '))).toBe(true);
    expect(startsSentence(gap('Ich sehe '))).toBe(false);
    expect(startsSentence(gap('z. B. das, '))).toBe(false);
  });

  it('capitalises only the first letter', () => {
    expect(capitaliseFirst('die')).toBe('Die');
    expect(capitaliseFirst('über den')).toBe('Über den');
    expect(capitaliseFirst('')).toBe('');
  });
});
