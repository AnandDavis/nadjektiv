/**
 * XP → level. Each level needs 100 XP more than the last:
 * level 2 at 100 XP, level 3 at 300, level 4 at 600, level 5 at 1000 …
 */

import type { Bilingual } from '../i18n/copy';

const XP_STEP = 100;

export interface LevelInfo {
  level: number;
  title: Bilingual;
  /** XP needed to reach this level. */
  floorXp: number;
  /** XP needed to reach the next level. */
  nextXp: number;
  /** 0–1 progress through the current level. */
  fraction: number;
}

const TITLES: ReadonlyArray<readonly [minLevel: number, title: Bilingual]> = [
  [1, { de: 'Anfänger', en: 'Beginner' }],
  [3, { de: 'Lernender', en: 'Learner' }],
  [5, { de: 'Entdecker', en: 'Explorer' }],
  [8, { de: 'Kenner', en: 'Connoisseur' }],
  [12, { de: 'Könner', en: 'Adept' }],
  [16, { de: 'Experte', en: 'Expert' }],
  [20, { de: 'Meister', en: 'Master' }],
  [25, { de: 'Grammatik-Profi', en: 'Grammar pro' }],
];

/** Total XP needed to reach `level` (level 1 = 0). */
export function xpForLevel(level: number): number {
  return (XP_STEP * level * (level - 1)) / 2;
}

export function titleForLevel(level: number): Bilingual {
  let title = TITLES[0][1];
  for (const [minLevel, name] of TITLES) {
    if (level >= minLevel) title = name;
  }
  return title;
}

export function levelForXp(xp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const floorXp = xpForLevel(level);
  const nextXp = xpForLevel(level + 1);
  return {
    level,
    title: titleForLevel(level),
    floorXp,
    nextXp,
    fraction: (xp - floorXp) / (nextXp - floorXp),
  };
}
