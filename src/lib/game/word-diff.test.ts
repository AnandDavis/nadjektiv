import { describe, expect, it } from 'vitest';

import type { BuildQuestion } from '@/content/types';

import { diffBuiltSentence, diffClosest } from './word-diff';

const question: BuildQuestion = {
  id: 'b',
  kind: 'build',
  translation: '',
  tiles: ['als', 'ich', 'ein', 'Kind', 'war', ',', 'habe', 'ich', 'in', 'Polen', 'gewohnt'],
  accepted: [['ich', 'habe', 'in', 'Polen', 'gewohnt', ',', 'als', 'ich', 'ein', 'Kind', 'war']],
  punctuation: '.',
  explanation: '',
};

const wrong = (words: { text: string; isRight: boolean }[]) =>
  words.filter((w) => !w.isRight).map((w) => w.text);

describe('diffBuiltSentence', () => {
  it('marks only the words out of place, on both sides', () => {
    const diff = diffBuiltSentence(question, 'Als ich ein Kind war ich habe in Polen gewohnt.');
    // "ich habe" should be "habe ich": one of the pair is out of place.
    expect(wrong(diff.given)).toHaveLength(1);
    expect(wrong(diff.answer)).toHaveLength(1);
    expect(diff.given.filter((w) => w.isRight)).toHaveLength(9);
  });

  it('compares with the accepted order the learner was closest to', () => {
    const diff = diffBuiltSentence(question, 'Ich habe in Polen gewohnt, als ich Kind ein war.');
    expect(diff.answer[0].text).toBe('Ich');
    expect(wrong(diff.given)).toEqual(['Kind']);
  });

  it('ignores commas and capitals when matching words', () => {
    const diff = diffBuiltSentence(question, 'Als ich ein Kind war, habe ich in Polen gewohnt.');
    expect(wrong(diff.given)).toEqual([]);
  });
});

describe('diffClosest', () => {
  it('marks the words outside the longest shared run', () => {
    const diff = diffClosest('Ich bin heute müde.', ['Heute bin ich müde.']);
    expect(diff.answer.filter((w) => !w.isRight).map((w) => w.text)).toHaveLength(2);
    expect(diff.given.at(-1)).toEqual({ text: 'müde.', isRight: true });
  });
});

describe('diffClosest with nothing to compare', () => {
  it('marks every given word as out of place', () => {
    expect(diffClosest('Ich bin müde.', [])).toEqual({
      given: [
        { text: 'Ich', isRight: false },
        { text: 'bin', isRight: false },
        { text: 'müde.', isRight: false },
      ],
      answer: [],
    });
  });
});
