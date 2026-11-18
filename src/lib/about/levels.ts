/**
 * Facts for the About page's "Levels and XP" section, derived from the real rules so
 * the explanation can never drift from how the game scores.
 */

import { GAME_CONFIG } from '@/config/game';

import type { Bilingual } from '../i18n/copy';
import { LEVEL_TITLES, xpForLevel } from '../progress/level';
import { TIER_RULES } from '../progress/mastery';

export interface LevelRow {
  level: number;
  /** XP needed to go from the previous level to this one (0 for level 1). */
  stepXp: number;
  /** Total XP needed to reach this level. */
  totalXp: number;
  /** Set when this level unlocks a new title. */
  newTitle?: Bilingual;
}

export function levelTable(maxLevel: number): LevelRow[] {
  return Array.from({ length: maxLevel }, (_, i) => {
    const level = i + 1;
    const title = LEVEL_TITLES.find(([minLevel]) => minLevel === level)?.[1];
    return {
      level,
      stepXp: level === 1 ? 0 : xpForLevel(level) - xpForLevel(level - 1),
      totalXp: xpForLevel(level),
      ...(title ? { newTitle: title } : {}),
    };
  });
}

/** The highest level that unlocks a title, so the table can end there. */
export const LAST_TITLE_LEVEL = LEVEL_TITLES[LEVEL_TITLES.length - 1][0];

export interface ComboStep {
  /** Right answers in a row needed for this multiplier. */
  inARow: number;
  multiplier: number;
  pointsPerAnswer: number;
}

export function comboSteps(): ComboStep[] {
  const { perCorrect, comboStep, maxMultiplier } = GAME_CONFIG.points;
  return Array.from({ length: maxMultiplier }, (_, i) => ({
    inARow: i === 0 ? 1 : i * comboStep,
    multiplier: i + 1,
    pointsPerAnswer: perCorrect * (i + 1),
  }));
}

export const PERFECT_BONUS_XP = GAME_CONFIG.points.perfectBonusXp;

export const MEDAL_RULES = TIER_RULES;
