import { afterEach, describe, expect, it, vi } from 'vitest';

import { OPTIONS, readOption, writeOption } from './options';
import { PREFERENCES_SCRIPT, WELCOME_KEY } from './preferences';
import { subscribePreferences } from './pref-store';

afterEach(() => {
  window.localStorage.clear();
  for (const def of Object.values(OPTIONS)) {
    if ('attribute' in def && def.attribute)
      document.documentElement.removeAttribute(def.attribute);
  }
});

describe('options', () => {
  it('read their default until changed, and store only a change', () => {
    expect(readOption(OPTIONS.hints)).toBe('button');
    const listener = vi.fn();
    const unsubscribe = subscribePreferences(listener);
    writeOption(OPTIONS.hints, 'hidden');
    expect(readOption(OPTIONS.hints)).toBe('hidden');
    expect(listener).toHaveBeenCalled();
    writeOption(OPTIONS.hints, 'button');
    expect(window.localStorage.getItem(OPTIONS.hints.key)).toBeNull();
    unsubscribe();
  });

  it('ignore a stored value that is not one of theirs', () => {
    window.localStorage.setItem(OPTIONS.textSize.key, 'enormous');
    expect(readOption(OPTIONS.textSize)).toBe('normal');
  });

  it('carry layout options on <html>, set and cleared', () => {
    const root = document.documentElement;
    writeOption(OPTIONS.textSize, 'larger');
    expect(root.dataset.textSize).toBe('larger');
    writeOption(OPTIONS.textSize, 'normal');
    expect(root.dataset.textSize).toBeUndefined();
  });

  it('are applied before paint by the inline script, valid values only', () => {
    window.localStorage.setItem(WELCOME_KEY, '1');
    window.localStorage.setItem(OPTIONS.textSize.key, 'large');
    window.localStorage.setItem(OPTIONS.motion.key, 'reduce');
    window.localStorage.setItem(OPTIONS.translations.key, 'sideways');
    new Function(PREFERENCES_SCRIPT)();
    const root = document.documentElement;
    expect(root.dataset.textSize).toBe('large');
    expect(root.dataset.motion).toBe('reduce');
    expect(root.dataset.translations).toBeUndefined();
  });
});
