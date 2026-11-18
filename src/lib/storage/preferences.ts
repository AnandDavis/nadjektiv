/**
 * Display preferences (theme, interface language). Kept separate from progress
 * because an inline script in the root layout applies them before first paint
 * (see PREFERENCES_SCRIPT), which avoids a flash of the wrong theme or language.
 */

import { APP_CONFIG, STORAGE_CONFIG } from '@/config/app';

import { PROGRESS_KEY } from './keys';

export type ThemePreference = 'system' | 'light' | 'dark';
/** Language of headings and labels. Grammar content is always German. */
export type UiLanguage = 'de' | 'en';

export const THEME_KEY = `${STORAGE_CONFIG.keyPrefix}:theme`;
export const UI_LANGUAGE_KEY = `${STORAGE_CONFIG.keyPrefix}:ui-language`;
export const DEFAULT_UI_LANGUAGE: UiLanguage = 'de';
/** Set once the welcome intro is finished or skipped. Not progress: a reset keeps it. */
export const WELCOME_KEY = `${STORAGE_CONFIG.keyPrefix}:welcome-seen`;
export const WELCOME_PATH = '/welcome';

/** Address-bar colour for a forced theme: the header's, so the two read as one block. */
export const THEME_COLORS = {
  light: APP_CONFIG.colors.headerLight,
  dark: APP_CONFIG.colors.headerDark,
} as const;

/**
 * id of the <meta name="theme-color"> that overrides the layout's system-following
 * pair when the learner forces a theme. It goes first in <head>, because browsers use
 * the first theme-color whose media matches, and it has no media, so it always does.
 */
export const THEME_COLOR_OVERRIDE_ID = 'theme-color-override';

/**
 * Runs in <head> before paint; must stay dependency-free ES5. Applies the theme and
 * language, and sends a first-time visitor from the home page to the welcome intro
 * before the home page can show. Anyone with progress already saved counts as having
 * seen it, so existing learners are never sent there, even after resetting progress.
 */
export const PREFERENCES_SCRIPT = `(function(){try{var d=document.documentElement,s=localStorage,t=s.getItem("${THEME_KEY}"),l=s.getItem("${UI_LANGUAGE_KEY}");if(!s.getItem("${WELCOME_KEY}")){if(s.getItem("${PROGRESS_KEY}"))s.setItem("${WELCOME_KEY}","1");else if(location.pathname==="/"){location.replace("${WELCOME_PATH}");return}}if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);var m=document.createElement("meta");m.id="${THEME_COLOR_OVERRIDE_ID}";m.name="theme-color";m.content=t==="dark"?"${THEME_COLORS.dark}":"${THEME_COLORS.light}";document.head.insertBefore(m,document.head.firstChild)}if(l==="en")d.setAttribute("data-ui-lang","en")}catch(e){}})()`;

const listeners = new Set<() => void>();

export function subscribePreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  for (const listener of listeners) listener();
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save preference ${key}.`, error);
  }
}

export function readTheme(): ThemePreference {
  const value = read(THEME_KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

/** Points the browser's address bar at the forced theme, or back at the system one. */
function applyThemeColor(theme: ThemePreference): void {
  let meta = document.getElementById(THEME_COLOR_OVERRIDE_ID) as HTMLMetaElement | null;
  if (theme === 'system') {
    meta?.remove();
    return;
  }
  if (!meta) {
    meta = document.createElement('meta');
    meta.id = THEME_COLOR_OVERRIDE_ID;
    meta.name = 'theme-color';
    document.head.prepend(meta);
  }
  meta.content = THEME_COLORS[theme];
}

export function writeTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  applyThemeColor(theme);
  write(THEME_KEY, theme === 'system' ? null : theme);
  notify();
}

export function readUiLanguage(): UiLanguage {
  return read(UI_LANGUAGE_KEY) === 'en' ? 'en' : DEFAULT_UI_LANGUAGE;
}

export function writeUiLanguage(language: UiLanguage): void {
  const root = document.documentElement;
  if (language === 'en') root.setAttribute('data-ui-lang', 'en');
  else root.removeAttribute('data-ui-lang');
  write(UI_LANGUAGE_KEY, language === DEFAULT_UI_LANGUAGE ? null : language);
  notify();
}

export function readWelcomeSeen(): boolean {
  return read(WELCOME_KEY) !== null;
}

export function markWelcomeSeen(): void {
  write(WELCOME_KEY, '1');
}
