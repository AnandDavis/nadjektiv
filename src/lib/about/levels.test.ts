import { describe, expect, it } from 'vitest';

import { comboMultiplier, pointsForCorrect } from '../game/scoring';
import { levelForXp } from '../progress/level';
import { LAST_TITLE_LEVEL, comboSteps, levelTable } from './levels';

describe('levelTable', () => {
  it('matches the real level maths', () => {
    const rows = levelTable(LAST_TITLE_LEVEL);
    expect(rows[0]).toMatchObject({ level: 1, stepXp: 0, totalXp: 0 });
    expect(rows[1]).toMatchObject({ level: 2, stepXp: 100, totalXp: 100 });
    expect(rows[2]).toMatchObject({ level: 3, stepXp: 200, totalXp: 300 });
    for (const row of rows) expect(levelForXp(row.totalXp).level).toBe(row.level);
  });

  it('marks the levels that unlock a title', () => {
    const titled = levelTable(LAST_TITLE_LEVEL).filter((r) => r.newTitle);
    expect(titled[0]).toMatchObject({ level: 1, newTitle: { de: 'Anfänger' } });
    expect(titled[titled.length - 1].level).toBe(LAST_TITLE_LEVEL);
  });
});

describe('comboSteps', () => {
  it('describes the same multipliers the game applies', () => {
    for (const step of comboSteps()) {
      expect(comboMultiplier(step.inARow)).toBe(step.multiplier);
      expect(pointsForCorrect(step.inARow - 1)).toBe(step.pointsPerAnswer);
    }
  });
});
