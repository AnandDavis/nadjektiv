import { describe, expect, it } from 'vitest';

import { builtBy, comboLine, dailyHint, missedTimes, stepOf, untimedBlitzHint } from './copy';

describe('copy helpers', () => {
  it('fill in their numbers and names in both languages', () => {
    expect(stepOf(2, 3)).toEqual({ de: 'Schritt 2 von 3', en: 'Step 2 of 3' });
    expect(comboLine(3)).toEqual({ de: 'Kombo ×3!', en: 'Combo ×3!' });
    expect(missedTimes(2)).toEqual({ de: '2× falsch', en: 'missed 2×' });
    expect(builtBy('Nad', 'London')).toEqual({
      de: 'Gebaut von Nad in London',
      en: 'Built by Nad in London',
    });
    expect(untimedBlitzHint(20).en).toBe('Untimed Blitz has 20 words and its own bests.');
    expect(dailyHint(10, true).en).toMatch(/^10 questions from your revise list/);
    expect(dailyHint(10, false)).toEqual({
      de: '10 Fragen zum Einstieg',
      en: '10 questions to get you started',
    });
  });
});
