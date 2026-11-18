import { describe, expect, it } from 'vitest';

import { shortcutFor, type KeyPress } from './shortcuts';

const press = (key: string, extra: Partial<KeyPress> = {}): KeyPress => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  isTyping: false,
  isOnControl: false,
  ...extra,
});

describe('shortcutFor', () => {
  it('chooses with 1–4 or the letters shown on the options', () => {
    expect(shortcutFor(press('1'))).toEqual({ type: 'choose', index: 0 });
    expect(shortcutFor(press('4'))).toEqual({ type: 'choose', index: 3 });
    expect(shortcutFor(press('C'))).toEqual({ type: 'choose', index: 2 });
    expect(shortcutFor(press('5'))).toBeNull();
    expect(shortcutFor(press('0'))).toBeNull();
  });

  it('maps Enter, H and Backspace', () => {
    expect(shortcutFor(press('Enter'))).toEqual({ type: 'confirm' });
    expect(shortcutFor(press('h'))).toEqual({ type: 'hint' });
    expect(shortcutFor(press('Backspace'))).toEqual({ type: 'undo' });
    expect(shortcutFor(press('x'))).toBeNull();
  });

  it('never steals keys while typing or from browser shortcuts', () => {
    expect(shortcutFor(press('a', { isTyping: true }))).toBeNull();
    expect(shortcutFor(press('Backspace', { isTyping: true }))).toBeNull();
    expect(shortcutFor(press('1', { metaKey: true }))).toBeNull();
    expect(shortcutFor(press('c', { ctrlKey: true }))).toBeNull();
    expect(shortcutFor(press('h', { altKey: true }))).toBeNull();
  });

  it('leaves Enter on a focused button to the button itself', () => {
    expect(shortcutFor(press('Enter', { isOnControl: true }))).toBeNull();
    expect(shortcutFor(press('2', { isOnControl: true }))).toEqual({ type: 'choose', index: 1 });
  });
});
