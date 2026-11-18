/**
 * App identity. Change the name, description or brand colours here and every page,
 * the web manifest, metadata and exports follow.
 */
export const APP_CONFIG = {
  name: 'Nadjektiv',
  /** Shown under the home-screen icon; keep it ≤ 12 characters. */
  shortName: 'Nadjektiv',
  description:
    'Learn German A1–A2 grammar through quick games: sort, fill the gap, build sentences.',
  /** Source code; the About page links the running build's commit here. */
  repositoryUrl: 'https://github.com/AnandDavis/nadjektiv',
  /** File name prefix for progress exports (safe to change). */
  exportFilePrefix: 'nadjektiv-progress',
  /**
   * The page background (--canvas in src/app/globals.css) as literal colours, for places
   * CSS variables can't reach: the manifest and <meta theme-color>, which colours the
   * browser's address bar. A test keeps them in sync with the stylesheet.
   */
  colors: {
    canvasLight: '#efebe0',
    canvasDark: '#141414',
  },
} as const;

/**
 * Identifiers baked into data learners have already saved. Unlike the app name these
 * must NOT change: a new storage prefix would hide everyone's progress and settings,
 * and a new export marker would reject files exported earlier. Add a migration first
 * if they ever have to move.
 */
export const STORAGE_CONFIG = {
  keyPrefix: 'grammatik',
  exportMarker: 'grammatik-games',
} as const;
