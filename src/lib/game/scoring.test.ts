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
  const answer = (isCorrect: boolean) => ({ questionId: 'q', topicId: 't', given: 'x', isCorrect });

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

describe('comboChange', () => {
  it('reports a rise in the multiplier, and losing a raised one', async () => {
    const { comboChange, COMBO_STEP } = await import('./scoring');
    expect(comboChange(COMBO_STEP - 1, COMBO_STEP)).toEqual({ kind: 'up', multiplier: 2 });
    expect(comboChange(0, 1)).toBeUndefined();
    expect(comboChange(COMBO_STEP + 1, 0)).toEqual({ kind: 'lost', multiplier: 2 });
    expect(comboChange(2, 0)).toBeUndefined();
  });
});

describe('runBreakers', () => {
  it('names the wrong answers that ended a raised run, mirroring hints', async () => {
    const { runBreakers, COMBO_STEP } = await import('./scoring');
    const answer = (questionId: string, isCorrect: boolean, hinted = false) => ({
      questionId,
      topicId: 't',
      given: '',
      isCorrect,
      hinted,
    });
    const run = Array.from({ length: COMBO_STEP }, (_, i) => answer(`r${i}`, true));
    expect(runBreakers([...run, answer('x', false)])).toEqual(['x']);
    expect(runBreakers([answer('a', true), answer('y', false)])).toEqual([]);
    const hintedRun = run.map((a) => ({ ...a, hinted: true }));
    expect(runBreakers([...hintedRun, answer('z', false)])).toEqual([]);
  });
});
