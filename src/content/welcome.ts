/**
 * The welcome intro shown on first open (src/app/welcome). Interface text, so every
 * line is German and English; the learner picks which on the first step.
 */
import type { GameMode } from '@/content/types';
import { GAME_CONFIG } from '@/config/game';
import type { Bilingual } from '@/lib/i18n/copy';

/** "Deutsche Grammatik A1–A2 …" with the live topic count. */
export function welcomeIntro(topicCount: number): Bilingual {
  return {
    de: `Deutsche Grammatik A1–A2 in kurzen Spielen statt Pauken: ${topicCount} Themen, von den Artikeln bis zum Präteritum.`,
    en: `German A1–A2 grammar through short games instead of drills: ${topicCount} topics, from articles to the Präteritum.`,
  };
}

/** One line per game, in the order the games are introduced. */
export const WELCOME_GAMES: ReadonlyArray<{ mode: GameMode; line: Bilingual }> = [
  {
    mode: 'sort',
    line: {
      de: `${GAME_CONFIG.sortRoundSeconds} Sekunden: Sortiere so viele Wörter, wie du schaffst.`,
      en: `${GAME_CONFIG.sortRoundSeconds} seconds: sort as many words as you can.`,
    },
  },
  {
    mode: 'gap',
    line: {
      de: 'Wähle das Wort, das in die Lücke passt.',
      en: 'Pick the word that fills the gap.',
    },
  },
  {
    mode: 'build',
    line: {
      de: 'Tippe die Wörter in die richtige Reihenfolge.',
      en: 'Tap the words into the right order.',
    },
  },
  {
    mode: 'grid',
    line: {
      de: 'Fülle eine ganze Tabelle gegen die Uhr aus.',
      en: 'Fill in a whole table against the clock.',
    },
  },
];

export const WELCOME_GENDERS: Bilingual = {
  de: 'Die Formen bedeuten überall dasselbe: der ist ein blaues Quadrat, die ein roter Kreis, das ein gelbes Dreieck.',
  en: 'The shapes mean the same everywhere: der is a blue square, die a red circle, das a yellow triangle.',
};

export const WELCOME_MISTAKES: Bilingual = {
  de: 'Jede falsche Antwort wird erklärt, bevor es weitergeht, und landet auf deiner Liste zum Wiederholen.',
  en: 'Every wrong answer is explained before you move on, and goes on your list to revise.',
};

export const WELCOME_PROGRESS: readonly Bilingual[] = [
  {
    de: 'Dein Fortschritt wird auf diesem Gerät gespeichert. Du brauchst kein Konto.',
    en: 'Your progress is saved on this device. You don’t need an account.',
  },
  {
    de: 'Keine Serien, kein Druck: Eine Pause kostet dich nichts.',
    en: 'No streaks, no pressure: taking a break costs you nothing.',
  },
  {
    de: 'Mit „Exportieren“ in den Einstellungen sicherst du deinen Fortschritt oder nimmst ihn auf ein anderes Gerät mit.',
    en: 'Use Export in Settings to back up your progress or move it to another device.',
  },
  {
    de: 'Leg die App auf deinen Startbildschirm. Danach funktioniert sie auch offline.',
    en: 'Add the app to your home screen. After that it works offline too.',
  },
];
