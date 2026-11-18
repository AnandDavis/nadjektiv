import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';
import type { BuildQuestion, GapQuestion, SortQuestion } from '@/content/types';

import { HINT_BLANK, hintFor } from './hint';

const gap = (answer: string, explanation: string): GapQuestion => ({
  id: 'g',
  kind: 'gap',
  before: '',
  after: '',
  options: [answer, 'x'],
  answer,
  translation: '',
  explanation,
});

describe('hintFor', () => {
  it('blanks the answer out of the explanation, as a whole word and in any case', () => {
    expect(hintFor(gap('keine', 'die Zeit is feminine; feminine Akkusativ is keine.'))).toBe(
      `die Zeit is feminine; feminine Akkusativ is ${HINT_BLANK}.`,
    );
    expect(hintFor(gap('Wenn', 'wenn is for if; als is for one moment.'))).toBe(
      `${HINT_BLANK} is for if; als is for one moment.`,
    );
    // "den" inside "Garden" is left alone.
    expect(hintFor(gap('den', 'In the Garden, den is accusative.'))).toBe(
      `In the Garden, ${HINT_BLANK} is accusative.`,
    );
  });

  it('blanks an ending wherever it is quoted with its hyphen', () => {
    expect(hintFor(gap('es', 'Neuter with no article takes -es.'))).toBe(
      `Neuter with no article takes -${HINT_BLANK}.`,
    );
  });

  it('never quotes the whole sentence in a sentence-builder hint', () => {
    const build: BuildQuestion = {
      id: 'b',
      kind: 'build',
      translation: '',
      tiles: ['ich', 'bin', 'müde'],
      punctuation: '.',
      explanation: 'Verb second: Ich bin müde.',
    };
    expect(hintFor(build)).toBe(`Verb second: ${HINT_BLANK}.`);
  });

  it('gives Blitz no hints', () => {
    const sort: SortQuestion = {
      id: 's',
      kind: 'sort',
      prompt: 'Hund',
      answer: 'der',
      explanation: '',
    };
    expect(hintFor(sort)).toBeUndefined();
  });

  it('never gives the answer away in any real gap question', () => {
    for (const topic of TOPICS) {
      for (const question of topic.gap ?? []) {
        const hint = hintFor(question)!;
        const answer = new RegExp(
          `(?<!\\p{L})${question.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\p{L})`,
          'iu',
        );
        expect(answer.test(hint), `${question.id}: ${hint}`).toBe(false);
      }
    }
  });
});
