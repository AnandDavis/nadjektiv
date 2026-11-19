import type { GameMode, MixedMode } from '@/content/types';
import type { Bilingual } from '@/lib/i18n/bilingual';

import { SESSION_LENGTH, SORT_ROUND_SECONDS } from './session';

export interface ModeInfo {
  name: string;
  /** What the game is, under its name. */
  subtitle: Bilingual;
  description: Bilingual;
}

export const MODE_INFO: Record<GameMode, ModeInfo> = {
  sort: {
    name: 'Blitz',
    subtitle: { de: 'Blitzschnell sortieren', en: 'Rapid-fire sorter' },
    description: {
      de: `So viele wie möglich in ${SORT_ROUND_SECONDS} Sekunden sortieren. Serien richtiger Antworten vervielfachen deine Punkte.`,
      en: `Sort as many as you can in ${SORT_ROUND_SECONDS} seconds. Runs of right answers multiply your points.`,
    },
  },
  gap: {
    name: 'Lückentext',
    subtitle: { de: 'Lücke füllen', en: 'Fill the gap' },
    description: {
      de: `${SESSION_LENGTH.gap} Sätze. Wähl das passende Wort und sieh dir an, warum.`,
      en: `${SESSION_LENGTH.gap} sentences. Pick the word that fits, then see why.`,
    },
  },
  type: {
    name: 'Tippen',
    subtitle: { de: 'Selbst schreiben', en: 'Type the answer' },
    description: {
      de: `${SESSION_LENGTH.type} Sätze. Tipp das fehlende Wort selbst, ohne Auswahl.`,
      en: `${SESSION_LENGTH.type} sentences. Type the missing word yourself, with nothing to pick from.`,
    },
  },
  build: {
    name: 'Satzbau',
    subtitle: { de: 'Sätze bauen', en: 'Sentence builder' },
    description: {
      de: `${SESSION_LENGTH.build} Sätze. Tipp die Wörter in der richtigen Reihenfolge an.`,
      en: `${SESSION_LENGTH.build} sentences. Tap the words into the right order.`,
    },
  },
  grid: {
    name: 'Tabelle',
    subtitle: { de: 'Gegen die Uhr ausfüllen', en: 'Grid fill' },
    description: {
      de: 'Füll eine ganze Tabelle aus, bevor die Zeit abläuft. Jedes Feld rastet ein, sobald es stimmt.',
      en: 'Fill in a whole table before the clock runs out. Each cell locks when it’s right.',
    },
  },
};

/** Mixed review, the daily mix and level tests draw from many topics and set no topic bests. */
export function isMixedMode(mode: string): mode is MixedMode {
  return mode === 'review' || mode === 'daily' || mode === 'exam';
}
