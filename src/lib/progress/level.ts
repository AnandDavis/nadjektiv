/**
 * XP → level. Each level needs 100 XP more than the last:
 * level 2 at 100 XP, level 3 at 300, level 4 at 600, level 5 at 1000 …
 */

const XP_STEP = 100;

export interface LevelInfo {
  level: number;
  title: string;
  /** XP needed to reach this level. */
  floorXp: number;
  /** XP needed to reach the next level. */
  nextXp: number;
  /** 0–1 progress through the current level. */
  fraction: number;
}

const TITLES: ReadonlyArray<readonly [minLevel: number, title: string]> = [
  [1, 'Anfänger'],
  [3, 'Lernender'],
  [5, 'Entdecker'],
  [8, 'Kenner'],
  [12, 'Könner'],
  [16, 'Experte'],
  [20, 'Meister'],
  [25, 'Grammatik-Profi'],
];

/** Total XP needed to reach `level` (level 1 = 0). */
export function xpForLevel(level: number): number {
  return (XP_STEP * level * (level - 1)) / 2;
}

export function titleForLevel(level: number): string {
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
