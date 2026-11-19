import { describe, expect, it } from 'vitest';

import type { BuildQuestion, GapQuestion, SortQuestion } from '@/content/types';

import { answerInContext } from './answer-in-context';

describe('answerInContext', () => {
  it('splits a gap sentence around its answer', () => {
    const q = { kind: 'gap', before: 'Ich sehe ', answer: 'den', after: ' Hund.' } as GapQuestion;
    expect(answerInContext(q)).toEqual({ before: 'Ich sehe ', answer: 'den', after: ' Hund.' });
  });

  it('fills a sort prompt’s slot, or puts the answer after an arrow', () => {
    const slot = {
      kind: 'sort',
      prompt: 'Wir gehen durch ___ Park.',
      answer: 'den',
    } as SortQuestion;
    expect(answerInContext(slot)).toEqual({
      before: 'Wir gehen durch ',
      answer: 'den',
      after: ' Park.',
    });
    const word = { kind: 'sort', prompt: 'Tisch', answer: 'der' } as SortQuestion;
    expect(answerInContext(word)).toEqual({ before: 'Tisch → ', answer: 'der', after: '' });
  });

  it('gives a built sentence as the whole answer', () => {
    const q = {
      kind: 'build',
      tiles: ['Ich', 'komme', 'heute'],
      punctuation: '.',
    } as BuildQuestion;
    expect(answerInContext(q)).toEqual({ before: '', answer: 'Ich komme heute.', after: '' });
  });
});
