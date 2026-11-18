import { describe, expect, it } from 'vitest';

import { keyboardInset } from './keyboard-inset';

describe('keyboardInset', () => {
  it('is nothing without a keyboard or without the API', () => {
    expect(keyboardInset(800, { height: 800, offsetTop: 0 })).toBe(0);
    expect(keyboardInset(800, null)).toBe(0);
  });

  it('is the part of the page below the visible area', () => {
    expect(keyboardInset(800, { height: 480, offsetTop: 0 })).toBe(320);
    // iOS scrolls the visual viewport down inside the page as you type.
    expect(keyboardInset(800, { height: 480, offsetTop: 120 })).toBe(200);
  });

  it('never goes negative, and rounds to whole pixels', () => {
    expect(keyboardInset(800, { height: 760, offsetTop: 60 })).toBe(0);
    expect(keyboardInset(800, { height: 479.6, offsetTop: 0 })).toBe(320);
  });
});
