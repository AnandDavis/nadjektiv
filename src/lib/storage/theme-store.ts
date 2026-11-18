/**
 * Theme preference. Kept separate from progress because an inline script in the root
 * layout reads it before first paint (see THEME_SCRIPT).
 */

export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_KEY = 'grammatik:theme';

/** Runs in <head> before paint; must stay dependency-free ES5. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readTheme(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function writeTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  try {
    if (theme === 'system') window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn('Could not save theme preference.', error);
  }
}
