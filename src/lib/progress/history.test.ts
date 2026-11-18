import { describe, expect, it } from 'vitest';

import { accuracyPerWeek, answersPerDay, withHistory } from './history';

const answers = (right: number, wrong: number) => [
  ...Array.from({ length: right }, () => ({
    questionId: 'q',
    topicId: 't',
    isCorrect: true,
    given: '',
  })),
  ...Array.from({ length: wrong }, () => ({
    questionId: 'q',
    topicId: 't',
    isCorrect: false,
    given: '',
  })),
];

describe('withHistory', () => {
  it('adds to the day and drops days older than the window', () => {
    const one = withHistory(undefined, '2026-11-18', answers(3, 1));
    expect(one).toEqual({ '2026-11-18': { answered: 4, correct: 3 } });
    const two = withHistory(
      { ...one, '2026-01-01': { answered: 5, correct: 5 } },
      '2026-11-18',
      answers(1, 0),
    );
    expect(two).toEqual({ '2026-11-18': { answered: 5, correct: 4 } });
  });
});

describe('charts', () => {
  const history = {
    '2026-11-18': { answered: 10, correct: 8 },
    '2026-11-12': { answered: 10, correct: 4 },
    '2026-11-11': { answered: 10, correct: 10 },
  };

  it('lists answers for each recent day, zero for days off', () => {
    const days = answersPerDay(history, '2026-11-18', 7);
    expect(days.map((d) => d.day)).toEqual([
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15',
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
    ]);
    expect(days.map((d) => d.answered)).toEqual([10, 0, 0, 0, 0, 0, 10]);
  });

  it('gives each seven-day span its share right, none for empty weeks', () => {
    expect(accuracyPerWeek(history, '2026-11-18', 3)).toEqual([
      { end: '2026-11-04', answered: 0, accuracy: undefined },
      { end: '2026-11-11', answered: 10, accuracy: 1 },
      { end: '2026-11-18', answered: 20, accuracy: 0.6 },
    ]);
  });
});
