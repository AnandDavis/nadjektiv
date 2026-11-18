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
    reviewHint: {
      de: 'Die Fragen, die du am häufigsten falsch hast',
      en: 'The questions you miss most',
    },
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
  revise: {
    title: { de: 'Zu wiederholen', en: 'To revise' },
    navLabel: { de: 'Wiederholen', en: 'Revise' },
    intro: {
      de: 'Alles, was du falsch hattest – mit der richtigen Antwort und dem Warum. Beantworte es später richtig, dann verschwindet es von der Liste.',
      en: 'Everything you got wrong, with the right answer and why. Answer it correctly later and it leaves the list.',
    },
    practise: { de: 'Jetzt üben', en: 'Practise these' },
    practiseHint: {
      de: 'Gemischte Wiederholung: zuerst diese Fragen, dann deine schwächsten.',
      en: 'Mixed review: these questions first, then your weakest ones.',
    },
    empty: { de: 'Nichts zu wiederholen', en: 'Nothing to revise' },
    emptyHint: {
      de: 'Wenn du etwas falsch beantwortest, landet es hier.',
      en: 'When you get something wrong, it lands here.',
    },
    reviewAnyway: { de: 'Gemischte Wiederholung', en: 'Mixed review' },
    alsoCorrect: { de: 'Auch richtig', en: 'Also correct' },
    samePattern: { de: 'Mit derselben Antwort', en: 'Same answer' },
    seeRules: { de: 'Regeln ansehen', en: 'See the rules' },
    missed: { de: 'Mal falsch', en: 'times missed' },
    added: { de: 'neu auf deiner Wiederholungsliste', en: 'added to your revise list' },
    cleared: { de: 'von der Liste erledigt', en: 'cleared from your revise list' },
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
