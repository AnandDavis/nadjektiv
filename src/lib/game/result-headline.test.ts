import { describe, expect, it } from 'vitest';

import { COPY } from '../i18n/copy';
import { resultHeadline } from './result-headline';

const answers = (right: number, wrong: number) => [
  ...Array.from({ length: right }, () => ({
    questionId: 'q',
    topicId: 't',
    given: 'x',
    isCorrect: true,
  })),
  ...Array.from({ length: wrong }, () => ({
    questionId: 'q',
    topicId: 't',
    given: 'x',
    isCorrect: false,
  })),
];

describe('resultHeadline', () => {
  it('picks a headline by accuracy', () => {
    expect(resultHeadline([])).toBe(COPY.game.timeUp);
    expect(resultHeadline(answers(5, 0))).toBe(COPY.game.perfect);
    expect(resultHeadline(answers(7, 3))).toBe(COPY.game.wellDone);
    expect(resultHeadline(answers(6, 4))).toBe(COPY.game.keepGoing);
  });
});
