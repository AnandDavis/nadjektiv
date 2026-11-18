import { describe, expect, it } from 'vitest';

import {
  PERFECT_BONUS_XP,
  accuracy,
  comboMultiplier,
  pointsForCorrect,
  xpForSession,
} from './scoring';

describe('combo multiplier', () => {
  it('starts at 1 and steps up every 5 in a row, capped at 3', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(4)).toBe(1);
    expect(comboMultiplier(5)).toBe(2);
    expect(comboMultiplier(10)).toBe(3);
    expect(comboMultiplier(50)).toBe(3);
  });

  it('awards points using the combo including this answer', () => {
    expect(pointsForCorrect(0)).toBe(10);
    expect(pointsForCorrect(4)).toBe(20);
  });
});

describe('session xp', () => {
  const answer = (isCorrect: boolean) => ({ questionId: 'q', topicId: 't', isCorrect });

  it('computes accuracy, with 0 for no answers', () => {
    expect(accuracy([answer(true), answer(false)])).toBe(0.5);
    expect(accuracy([])).toBe(0);
  });

  it('adds a bonus for a perfect round', () => {
    const answers = [answer(true), answer(true)];
    expect(xpForSession({ mode: 'gap', answers, score: 20, bestCombo: 2 })).toBe(
      20 + PERFECT_BONUS_XP,
    );
  });

  it('gives no bonus when anything was wrong', () => {
    const answers = [answer(true), answer(false)];
    expect(xpForSession({ mode: 'gap', answers, score: 10, bestCombo: 1 })).toBe(10);
  });
});
