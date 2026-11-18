import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  PREFERENCES_SCRIPT,
  THEME_COLOR_OVERRIDE_ID,
  THEME_COLORS,
  THEME_KEY,
  UI_LANGUAGE_KEY,
  WELCOME_KEY,
  WELCOME_PATH,
  markWelcomeSeen,
  readWelcomeSeen,
  readTheme,
  readUiLanguage,
  subscribePreferences,
  writeTheme,
  writeUiLanguage,
} from './preferences';
import { PROGRESS_KEY } from './keys';

const override = () => document.getElementById(THEME_COLOR_OVERRIDE_ID) as HTMLMetaElement | null;

afterEach(() => {
  override()?.remove();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-ui-lang');
  vi.restoreAllMocks();
});

describe('theme preference', () => {
  it('defaults to following the system', () => {
    expect(readTheme()).toBe('system');
  });

  it('applies and stores an explicit theme, and clears it for system', () => {
    writeTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
    expect(readTheme()).toBe('dark');

    writeTheme('system');
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(window.localStorage.getItem(THEME_KEY)).toBeNull();
  });

  it('ignores unknown stored values', () => {
    window.localStorage.setItem(THEME_KEY, 'neon');
    expect(readTheme()).toBe('system');
  });
});

describe('interface language preference', () => {
  it('defaults to German', () => {
    expect(readUiLanguage()).toBe('de');
  });

  it('applies and stores English, and clears it for German', () => {
    writeUiLanguage('en');
    expect(document.documentElement.dataset.uiLang).toBe('en');
    expect(readUiLanguage()).toBe('en');

    writeUiLanguage('de');
    expect(document.documentElement.dataset.uiLang).toBeUndefined();
    expect(window.localStorage.getItem(UI_LANGUAGE_KEY)).toBeNull();
  });
});

describe('preferences plumbing', () => {
  it('notifies subscribers on every change', () => {
    const listener = vi.fn();
    const unsubscribe = subscribePreferences(listener);
    writeTheme('light');
    writeUiLanguage('en');
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    writeTheme('dark');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('colours the browser bar for a forced theme, ahead of the system pair', () => {
    const system = document.createElement('meta');
    system.name = 'theme-color';
    document.head.append(system);

    writeTheme('dark');
    expect(override()?.content).toBe(THEME_COLORS.dark);
    expect(document.head.firstElementChild).toBe(override());

    writeTheme('light');
    expect(document.querySelectorAll(`#${THEME_COLOR_OVERRIDE_ID}`)).toHaveLength(1);
    expect(override()?.content).toBe(THEME_COLORS.light);

    writeTheme('system');
    expect(override()).toBeNull();
    system.remove();
  });

  it('keeps working when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(readTheme()).toBe('system');
    expect(() => writeTheme('dark')).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('ships a pre-paint script that applies both stored preferences', () => {
    window.localStorage.setItem(WELCOME_KEY, '1');
    window.localStorage.setItem(THEME_KEY, 'dark');
    window.localStorage.setItem(UI_LANGUAGE_KEY, 'en');
    new Function(PREFERENCES_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.uiLang).toBe('en');
    expect(override()?.content).toBe(THEME_COLORS.dark);
    expect(document.head.firstElementChild).toBe(override());
  });
});

describe('welcome intro', () => {
  /** Runs the pre-paint script with a stand-in for window.location. */
  function runScript(pathname: string) {
    const location = { pathname, replace: vi.fn() };
    new Function('location', PREFERENCES_SCRIPT)(location);
    return location.replace;
  }

  afterEach(() => window.localStorage.clear());

  it('sends a first-time visitor from home to the intro, before anything is applied', () => {
    window.localStorage.setItem(THEME_KEY, 'dark');
    expect(runScript('/')).toHaveBeenCalledWith(WELCOME_PATH);
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('leaves deep links alone, so a shared topic link opens the topic', () => {
    expect(runScript('/topics/articles')).not.toHaveBeenCalled();
  });

  it('never sends someone with saved progress, and remembers that for after a reset', () => {
    window.localStorage.setItem(PROGRESS_KEY, '{}');
    expect(runScript('/')).not.toHaveBeenCalled();
    expect(readWelcomeSeen()).toBe(true);

    window.localStorage.removeItem(PROGRESS_KEY);
    expect(runScript('/')).not.toHaveBeenCalled();
  });

  it('is not shown again once finished or skipped', () => {
    expect(readWelcomeSeen()).toBe(false);
    markWelcomeSeen();
    expect(readWelcomeSeen()).toBe(true);
    expect(runScript('/')).not.toHaveBeenCalled();
  });
});
