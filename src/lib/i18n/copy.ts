/**
 * Every interface label that has a German and an English form. Learners choose which
 * one they see in Settings; grammar content is always German.
 */

export interface Bilingual {
  de: string;
  en: string;
}

export const COPY = {
  home: {
    heading: { de: 'Was üben wir heute?', en: 'What shall we practise today?' },
    review: { de: 'Gemischte Wiederholung', en: 'Mixed review' },
  },
  nav: {
    learn: { de: 'Lernen', en: 'Learn' },
    progress: { de: 'Fortschritt', en: 'Progress' },
    settings: { de: 'Einstellungen', en: 'Settings' },
  },
  topic: {
    play: { de: 'Spielen', en: 'Play' },
    rules: { de: 'Die Regeln', en: 'The rules' },
    next: { de: 'Nächstes Ziel', en: 'Next' },
  },
  game: {
    start: { de: 'Los geht’s!', en: 'Let’s go!' },
    correct: { de: 'Richtig!', en: 'Correct!' },
    wrong: { de: 'Nicht ganz', en: 'Not quite' },
    next: { de: 'Weiter', en: 'Continue' },
    youChose: { de: 'Deine Wahl', en: 'You chose' },
    answer: { de: 'Richtig ist', en: 'Answer' },
    why: { de: 'Warum?', en: 'Why?' },
    timeUp: { de: 'Zeit ist um!', en: 'Time’s up!' },
    perfect: { de: 'Perfekt!', en: 'Perfect!' },
    wellDone: { de: 'Gut gemacht!', en: 'Well done!' },
    keepGoing: { de: 'Weiter üben!', en: 'Keep practising!' },
    achievements: { de: 'Erfolge', en: 'Achievements' },
  },
  progress: {
    medals: { de: 'Medaillen', en: 'Medals' },
  },
  settings: {
    theme: { de: 'Design', en: 'Theme' },
    themeSystem: { de: 'System', en: 'System' },
    themeLight: { de: 'Hell', en: 'Light' },
    themeDark: { de: 'Dunkel', en: 'Dark' },
    language: { de: 'Sprache der Oberfläche', en: 'Interface language' },
    languageHint: {
      de: 'Überschriften und Knöpfe. Die Grammatik bleibt auf Deutsch.',
      en: 'Headings and buttons. Grammar questions stay in German.',
    },
  },
  notFound: {
    heading: { de: 'Diese Seite gibt es nicht.', en: 'That page doesn’t exist.' },
  },
} as const satisfies Record<string, Record<string, Bilingual>>;
