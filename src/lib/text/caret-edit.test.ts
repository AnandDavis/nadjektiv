import { describe, expect, it } from 'vitest';

import { applyKey } from './caret-edit';

const field = (value: string, start: number, end = start) => ({ value, start, end });

describe('applyKey', () => {
  it('inserts at the caret, or over the selection', () => {
    expect(applyKey(field('grße', 2), { type: 'insert', text: 'ö' })).toEqual({
      value: 'größe',
      caret: 3,
    });
    expect(applyKey(field('grsse', 2, 4), { type: 'insert', text: 'ö' })).toEqual({
      value: 'gröe',
      caret: 3,
    });
    expect(applyKey(field('', 0), { type: 'insert', text: ' ' })).toEqual({ value: ' ', caret: 1 });
  });

  it('backspaces the character before the caret, or the selection', () => {
    expect(applyKey(field('dem', 3), { type: 'backspace' })).toEqual({ value: 'de', caret: 2 });
    expect(applyKey(field('dem', 1, 3), { type: 'backspace' })).toEqual({ value: 'd', caret: 1 });
    expect(applyKey(field('dem', 0), { type: 'backspace' })).toEqual({ value: 'dem', caret: 0 });
  });

  it('copes with a reversed or out-of-range selection', () => {
    expect(applyKey(field('abc', 9), { type: 'insert', text: 'd' })).toEqual({
      value: 'abcd',
      caret: 4,
    });
    expect(applyKey(field('abc', 3, 1), { type: 'backspace' })).toEqual({ value: 'a', caret: 1 });
  });
});
