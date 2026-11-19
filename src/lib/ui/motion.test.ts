import { describe, expect, it } from 'vitest';

import { MOTION, countUpAt, easeOut, staggerDelay } from './motion';

describe('motion', () => {
  it('eases out from 0 to 1, clamped', () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
    expect(easeOut(0.5)).toBeGreaterThan(0.5);
    expect(easeOut(-1)).toBe(0);
    expect(easeOut(2)).toBe(1);
  });

  it('counts whole numbers up to the target and stops there', () => {
    expect(countUpAt(0, 80, 0, 500)).toBe(0);
    expect(countUpAt(0, 80, 250, 500)).toBe(70);
    expect(countUpAt(0, 80, 900, 500)).toBe(80);
    expect(countUpAt(20, 10, 500, 500)).toBe(10);
    expect(countUpAt(0, 80, 0, 0)).toBe(80);
  });

  it('staggers list items, capped for long lists', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(2)).toBe(2 * MOTION.staggerMs);
    expect(staggerDelay(500)).toBe(MOTION.maxStaggerMs);
    expect(staggerDelay(3, 20)).toBe(60);
  });
});
