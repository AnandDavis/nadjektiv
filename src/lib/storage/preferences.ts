/**
 * Display preferences (theme, interface language). Kept separate from progress
 * because an inline script in the root layout applies them before first paint
 * (see PREFERENCES_SCRIPT), which avoids a flash of the wrong theme or language.
 */

import { STORAGE_CONFIG } from '@/config/app';

export type ThemePreference = 'system' | 'light' | 'dark';
/** Language of headings and labels. Grammar content is always German. */
export type UiLanguage = 'de' | 'en';

export const THEME_KEY = `${STORAGE_CONFIG.keyPrefix}:theme`;
export const UI_LANGUAGE_KEY = `${STORAGE_CONFIG.keyPrefix}:ui-language`;
export const DEFAULT_UI_LANGUAGE: UiLanguage = 'de';

/** Runs in <head> before paint; must stay dependency-free ES5. */
export const PREFERENCES_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_KEY}"),l=localStorage.getItem("${UI_LANGUAGE_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);if(l==="en")d.setAttribute("data-ui-lang","en")}catch(e){}})()`;

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

export function writeTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
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
