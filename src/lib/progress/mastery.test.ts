import { describe, expect, it } from 'vitest';

import { masteryFor } from './mastery';
import type { TopicProgress } from './types';

function progress(
  answered: number,
  recentCorrect: number,
  recentTotal: number,
  modes: Array<'sort' | 'gap' | 'build'> = [],
): TopicProgress {
  const recent = Array.from(
    { length: recentTotal },
    (_, i) => (i < recentCorrect ? 1 : 0) as 0 | 1,
  );
  const best = { plays: 1, bestScore: 10, bestAccuracy: 1, bestCombo: 1 };
  return {
    answered,
    correct: recentCorrect,
    recent,
    modes: Object.fromEntries(modes.map((m) => [m, best])),
  };
}

describe('masteryFor', () => {
  it('is new with nothing answered', () => {
    const info = masteryFor(undefined, ['gap']);
    expect(info.tier).toBe('new');
    expect(info.next?.tier).toBe('bronze');
  });

  it('reaches bronze at 10 answers with 60%', () => {
    expect(masteryFor(progress(10, 6, 10), ['gap']).tier).toBe('bronze');
    expect(masteryFor(progress(10, 5, 10), ['gap']).tier).toBe('new');
  });

  it('needs every mode played for gold', () => {
    expect(masteryFor(progress(60, 36, 40, ['gap']), ['gap', 'sort']).tier).toBe('silver');
    expect(masteryFor(progress(60, 36, 40, ['gap', 'sort']), ['gap', 'sort']).tier).toBe('gold');
  });

  it('reaches mastered at 100 answers with 92%+', () => {
    expect(masteryFor(progress(100, 37, 40, ['gap']), ['gap']).tier).toBe('mastered');
  });

  it('drops back when recent accuracy falls', () => {
    expect(masteryFor(progress(100, 20, 40, ['gap']), ['gap']).tier).toBe('new');
  });

  it('lists unmet requirements for the next tier', () => {
    const info = masteryFor(progress(12, 10, 12), ['gap']);
    expect(info.tier).toBe('bronze');
    expect(info.next?.tier).toBe('silver');
    expect(info.next?.requirements.find((r) => !r.isMet)?.label.en).toMatch(/Answer 30/);
    expect(info.next?.requirements.find((r) => !r.isMet)?.label.de).toMatch(/30 Fragen/);
  });
});

describe('grid fill and medals', () => {
  it('never requires grid fill for gold or mastered', () => {
    const p = progress(100, 38, 40, ['gap', 'sort']);
    expect(masteryFor(p, ['sort', 'gap', 'grid']).tier).toBe('mastered');
  });
});
