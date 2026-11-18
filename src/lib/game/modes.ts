import type { GameMode } from '@/content/types';

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
  build: {
    name: 'Satzbau',
    english: 'Sentence builder',
    description: `${SESSION_LENGTH.build} sentences. Tap the words into the right order.`,
  },
};
