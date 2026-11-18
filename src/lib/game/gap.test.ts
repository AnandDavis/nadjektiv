import { describe, expect, it } from 'vitest';

import type { GapQuestion } from '@/content/types';

import { isEndingGap } from './gap';

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
