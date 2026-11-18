import { describe, expect, it } from 'vitest';

import { MODE_SHAPES, genderShape } from './shapes';

describe('shapes', () => {
  it('gives der, die and das their own shape, in any capitalisation', () => {
    expect(genderShape('der')).toEqual({ kind: 'square', color: 'blue' });
    expect(genderShape('Die')).toEqual({ kind: 'circle', color: 'red' });
    expect(genderShape('DAS')).toEqual({ kind: 'triangle', color: 'yellow' });
    expect(genderShape('den')).toBeUndefined();
  });

  it('gives each game mode a distinct shape', () => {
    const kinds = Object.values(MODE_SHAPES).map((s) => s.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });
});
