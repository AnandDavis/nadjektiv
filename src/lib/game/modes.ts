import type { GameMode, MixedMode } from '@/content/types';

import { SESSION_LENGTH, SORT_ROUND_SECONDS } from './session';

export interface ModeInfo {
  name: string;
  english: string;
  description: string;
}

export const MODE_INFO: Record<GameMode, ModeInfo> = {
  sort: {
    name: 'Blitz',
    english: 'Rapid-fire sorter',
    description: `Sort as many as you can in ${SORT_ROUND_SECONDS} seconds. Runs of right answers multiply your points.`,
  },
  gap: {
    name: 'Lückentext',
    english: 'Fill the gap',
    description: `${SESSION_LENGTH.gap} sentences. Pick the word that fits, then see why.`,
  },
  type: {
    name: 'Tippen',
    english: 'Type the answer',
    description: `${SESSION_LENGTH.type} sentences. Type the missing word yourself, with nothing to pick from.`,
  },
  build: {
    name: 'Satzbau',
    english: 'Sentence builder',
    description: `${SESSION_LENGTH.build} sentences. Tap the words into the right order.`,
  },
  grid: {
    name: 'Tabelle',
    english: 'Grid fill',
    description:
      'Fill in a whole table before the clock runs out. Each cell locks when it’s right.',
  },
};

/** Mixed review and the daily mix draw from many topics and set no topic bests. */
export function isMixedMode(mode: string): mode is MixedMode {
  return mode === 'review' || mode === 'daily';
}
