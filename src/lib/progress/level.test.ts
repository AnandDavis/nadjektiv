import { describe, expect, it } from 'vitest';

import { levelForXp, titleForLevel, xpForLevel } from './level';

describe('levels', () => {
  it('needs 100 more XP for each level', () => {
    expect([1, 2, 3, 4, 5].map(xpForLevel)).toEqual([0, 100, 300, 600, 1000]);
  });

  it('maps XP to a level and progress fraction', () => {
    expect(levelForXp(0)).toMatchObject({ level: 1, floorXp: 0, nextXp: 100, fraction: 0 });
    expect(levelForXp(150)).toMatchObject({ level: 2, fraction: 0.25 });
    expect(levelForXp(300).level).toBe(3);
  });

  it('gives titles by level', () => {
    expect(titleForLevel(1)).toEqual({ de: 'Anfänger', en: 'Beginner' });
    expect(titleForLevel(4).de).toBe('Lernender');
    expect(titleForLevel(40).en).toBe('Grammar pro');
  });
});
