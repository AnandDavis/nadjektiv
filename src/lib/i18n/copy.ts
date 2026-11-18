/**
 * Every interface label that has a German and an English form. Learners choose which
 * one they see in Settings; grammar content is always German.
 */

export interface Bilingual {
  de: string;
  en: string;
}

export const COPY = {
  daily: {
    title: { de: 'Tagesmix', en: 'Daily mix' },
    done: { de: 'Heute erledigt', en: 'Done today' },
    doneHint: {
      de: 'Morgen gibt es einen neuen Mix. Du kannst diesen trotzdem nochmal spielen.',
      en: 'A new mix tomorrow. You can still play this one again.',
    },
  },
  hint: {
    // "Half" matches GAME_CONFIG.points.hintFactor.
    show: { de: 'Hinweis zeigen · halbe Punkte', en: 'Show a hint · half points' },
    label: { de: 'Hinweis', en: 'Hint' },
  },
  typed: {
    yourAnswer: { de: 'Deine Antwort', en: 'Your answer' },
    check: { de: 'Prüfen', en: 'Check' },
    nearly: {
      de: 'Fast! Nur ein Buchstabe stimmt nicht. Das zählt trotzdem als falsch.',
      en: 'Nearly! Just one letter is off. It still counts as wrong.',
    },
    youTyped: { de: 'Du hast getippt', en: 'You typed' },
    locked: {
      de: 'Freigeschaltet, sobald du in diesem Thema eine Medaille hast.',
      en: 'Unlocks once you have a medal in this topic.',
    },
  },
  grid: {
    chooseTable: { de: 'Tabelle wählen', en: 'Choose a table' },
    cells: { de: 'Felder', en: 'Cells' },
    time: { de: 'Zeit', en: 'Time' },
    timeLimit: { de: 'Zeitlimit', en: 'Time limit' },
    bestTime: { de: 'Bestzeit', en: 'Best time' },
    mostCells: { de: 'Meiste Felder', en: 'Most cells' },
    start: { de: 'Starten', en: 'Start' },
    done: { de: 'Fertig', en: 'Done' },
    otherTable: { de: 'Andere Tabelle', en: 'Another table' },
    answerKey: { de: 'Die Lösung', en: 'The answers' },
    specialCharacters: { de: 'Sonderzeichen', en: 'Special characters' },
    typeHint: {
      de: 'Tippe in die leeren Felder. Richtige Felder werden grün und bleiben stehen.',
      en: 'Type into the empty cells. Correct cells turn green and stay.',
    },
  },
  search: {
    label: { de: 'Themen suchen', en: 'Search topics' },
    placeholder: { de: 'Thema suchen, z. B. Dativ', en: 'Search, e.g. dative' },
    clear: { de: 'Suche löschen', en: 'Clear search' },
    noResults: { de: 'Kein Thema gefunden', en: 'No topics found' },
    noResultsHint: {
      de: 'Probier ein anderes Wort, zum Beispiel „Perfekt“ oder „weil“.',
      en: 'Try another word, such as “past tense” or “weil”.',
    },
    showAll: { de: 'Alle Themen zeigen', en: 'Show all topics' },
  },
  home: {
    heading: { de: 'Was üben wir heute?', en: 'What shall we practise today?' },
    review: { de: 'Gemischte Wiederholung', en: 'Mixed review' },
    reviewHint: {
      de: 'Die Fragen, die du am häufigsten falsch hast',
      en: 'The questions you miss most',
    },
  },
  header: {
    menu: { de: 'Menü', en: 'Menu' },
    about: { de: 'Über die App', en: 'About' },
  },
  welcome: {
    heading: { de: 'Willkommen bei Nadjektiv', en: 'Welcome to Nadjektiv' },
    language: { de: 'Überschriften und Knöpfe auf', en: 'Headings and buttons in' },
    languageHint: {
      de: 'Die Grammatik ist immer auf Deutsch. Du kannst das später in den Einstellungen ändern.',
      en: 'The grammar is always in German. You can change this later in Settings.',
    },
    games: { de: 'Vier Spiele', en: 'Four games' },
    progress: { de: 'Dein Fortschritt', en: 'Your progress' },
    next: { de: 'Weiter', en: 'Next' },
    back: { de: 'Zurück', en: 'Back' },
    skip: { de: 'Überspringen', en: 'Skip' },
    start: { de: 'Los geht’s', en: 'Let’s go' },
    reopen: { de: 'Einführung ansehen', en: 'See the intro' },
  },
  about: {
    earningXp: { de: 'XP sammeln', en: 'Earning XP' },
    levelsTable: { de: 'Level', en: 'Levels' },
    xpForLevel: { de: 'XP für dieses Level', en: 'XP for this level' },
    totalXp: { de: 'XP gesamt', en: 'Total XP' },
    title: { de: 'Titel', en: 'Title' },
    features: { de: 'Was die App kann', en: 'What you can do' },
    levels: { de: 'Level und XP', en: 'Levels and XP' },
    tiers: { de: 'Medaillen pro Thema', en: 'Medals for each topic' },
    changelog: { de: 'Neuigkeiten', en: 'What’s new' },
    version: { de: 'Version', en: 'Version' },
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
  common: {
    level: { de: 'Level', en: 'Level' },
    points: { de: 'Punkte', en: 'Points' },
    correct: { de: 'Richtig', en: 'Correct' },
    answers: { de: 'Antworten', en: 'Answers' },
    topics: { de: 'Themen', en: 'Topics' },
    answered: { de: 'beantwortet', en: 'answered' },
    best: { de: 'Rekord', en: 'Best' },
    allTopics: { de: 'Alle Themen', en: 'All topics' },
    backToTopics: { de: 'Zurück zu den Themen', en: 'Back to the topics' },
    home: { de: 'Start', en: 'Home' },
    topic: { de: 'Thema', en: 'Topic' },
  },
  game: {
    bestScore: { de: 'Bestwert', en: 'Best score' },
    bestAccuracy: { de: 'Beste Quote', en: 'Best accuracy' },
    bestCombo: { de: 'Beste Serie', en: 'Best combo' },
    playAgain: { de: 'Nochmal', en: 'Play again' },
    mistakes: { de: 'Deine Fehler', en: 'Review your mistakes' },
    sayInGerman: { de: 'Auf Deutsch', en: 'Say in German' },
    tapWords: { de: 'Tippe die Wörter der Reihe nach an', en: 'Tap the words below in order' },
    clear: { de: 'Löschen', en: 'Clear' },
    check: { de: 'Prüfen', en: 'Check' },
    newBestScore: { de: 'Neuer Bestwert!', en: 'New best score!' },
    newBestAccuracy: { de: 'Neue beste Quote!', en: 'New best accuracy!' },
    newBestCombo: { de: 'Neue beste Serie!', en: 'New best combo!' },
    newBestTime: { de: 'Neue Bestzeit!', en: 'New best time!' },
    newBestCells: { de: 'So viele Felder wie noch nie!', en: 'Most cells ever!' },
    reached: { de: 'erreicht', en: 'reached' },
    mixedReview: { de: 'Gemischte Wiederholung', en: 'Mixed review' },
    nothingToReview: { de: 'Noch nichts zu wiederholen', en: 'Nothing to review yet' },
    nothingToReviewHint: {
      de: 'Spiel zuerst ein Thema. Dann mischt die Wiederholung die Fragen, die dir am schwersten fallen.',
      en: 'Play a topic first. Review then mixes in the questions you find hardest.',
    },
    chooseTopic: { de: 'Thema wählen', en: 'Choose a topic' },
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
    wholeRow: { de: 'Die ganze Zeile', en: 'The whole row' },
    seeRules: { de: 'Regeln ansehen', en: 'See the rules' },
    missed: { de: 'Mal falsch', en: 'times missed' },
    added: { de: 'neu auf deiner Wiederholungsliste', en: 'added to your revise list' },
    cleared: { de: 'von der Liste erledigt', en: 'cleared from your revise list' },
  },
  settings: {
    yourProgress: { de: 'Dein Fortschritt', en: 'Your progress' },
    progressHint: {
      de: 'Dein Fortschritt ist nur auf diesem Gerät gespeichert. Exportiere ihn als Sicherung oder für ein anderes Gerät.',
      en: 'Progress is saved on this device only. Export it to keep a backup or move to another device.',
    },
    export: { de: 'Exportieren', en: 'Export' },
    import: { de: 'Importieren', en: 'Import' },
    reset: { de: 'Fortschritt löschen', en: 'Reset progress' },
    confirmReset: {
      de: 'Allen Fortschritt auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen.',
      en: 'Delete all progress on this device? This can’t be undone.',
    },
    cancel: { de: 'Abbrechen', en: 'Cancel' },
    confirmResetButton: { de: 'Ja, löschen', en: 'Yes, reset' },
    exported: { de: 'Fortschritt exportiert.', en: 'Progress exported.' },
    imported: { de: 'Fortschritt importiert.', en: 'Progress imported.' },
    resetDone: { de: 'Fortschritt gelöscht.', en: 'Progress reset.' },
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

/** "3 von 10 richtig" / "3 of 10 correct" */
export function correctCount(correct: number, total: number): Bilingual {
  return { de: `${correct} von ${total} richtig`, en: `${correct} of ${total} correct` };
}

/** "Level up! Du bist jetzt Level 3:" / "Level up! You’re now level 3:" */
export function levelUpLine(level: number): Bilingual {
  return {
    de: `Level up! Du bist jetzt Level ${level}:`,
    en: `Level up! You’re now level ${level}:`,
  };
}

/** "3 Themen" / "3 topics" */
export function topicCount(count: number): Bilingual {
  return {
    de: `${count} ${count === 1 ? 'Thema' : 'Themen'}`,
    en: `${count} ${count === 1 ? 'topic' : 'topics'}`,
  };
}

/** "Schritt 2 von 3" / "Step 2 of 3" */
export function stepOf(step: number, total: number): Bilingual {
  return { de: `Schritt ${step} von ${total}`, en: `Step ${step} of ${total}` };
}

/** The daily mix's line on the home page, for a learner with or without progress. */
export function dailyHint(length: number, hasProgress: boolean): Bilingual {
  return hasProgress
    ? {
        de: `${length} Fragen aus deiner Wiederholungsliste und deinen schwächsten Themen`,
        en: `${length} questions from your revise list and your weakest topics`,
      }
    : { de: `${length} Fragen zum Einstieg`, en: `${length} questions to get you started` };
}
