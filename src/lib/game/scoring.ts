/**
 * Points, combos and XP for a game round.
 */

import { GAME_CONFIG } from '@/config/game';
import type { GameMode, MixedMode } from '@/content/types';

export const POINTS_PER_CORRECT = GAME_CONFIG.points.perCorrect;
/** Every COMBO_STEP correct answers in a row raises the multiplier by one. */
export const COMBO_STEP = GAME_CONFIG.points.comboStep;
export const MAX_MULTIPLIER = GAME_CONFIG.points.maxMultiplier;
export const PERFECT_BONUS_XP = GAME_CONFIG.points.perfectBonusXp;
export const HINT_FACTOR = GAME_CONFIG.points.hintFactor;

export interface AnswerRecord {
  /** What the learner chose: a bin, an option, or the built sentence. */
  given: string;
  questionId: string;
  topicId: string;
  isCorrect: boolean;
  /** A hint was used: a right answer then doesn't count towards mastery or revise. */
  hinted?: boolean;
}

/** Score for a whole round, ready to be applied to progress. */
export interface SessionResult {
  /** Undefined for mixed review sessions, which don't set personal bests. */
  topicId?: string;
  mode: GameMode | MixedMode;
  /** Daily mix only: the day it was played for (see dailyKey). */
  dailyDate?: string;
  /** Blitz without the clock: its bests are kept apart from timed Blitz. */
  untimed?: boolean;
  /** Grid rounds only: which table was played. */
  gridId?: string;
  /** Grid rounds only, and only when every cell was solved: time to complete. */
  timeMs?: number;
  answers: AnswerRecord[];
  score: number;
  bestCombo: number;
}

export function comboMultiplier(combo: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(combo / COMBO_STEP));
}

/** What an answer did to the combo multiplier: raised it, or broke a raised one. */
export type ComboChange = { kind: 'up'; multiplier: number } | { kind: 'lost'; multiplier: number };

export function comboChange(comboBefore: number, comboAfter: number): ComboChange | undefined {
  const before = comboMultiplier(comboBefore);
  const after = comboMultiplier(comboAfter);
  if (after > before) return { kind: 'up', multiplier: after };
  if (after < before) return { kind: 'lost', multiplier: before };
  return undefined;
}

/** Points for a correct answer given the combo *before* this answer. */
export function pointsForCorrect(comboBefore: number): number {
  return POINTS_PER_CORRECT * comboMultiplier(comboBefore + 1);
}

/** Points for a correct answer after a hint: a share of the points, at today's multiplier. */
export function pointsForHinted(comboBefore: number): number {
  return Math.round(POINTS_PER_CORRECT * comboMultiplier(comboBefore) * HINT_FACTOR);
}

export function accuracy(answers: readonly AnswerRecord[]): number {
  if (answers.length === 0) return 0;
  return answers.filter((a) => a.isCorrect).length / answers.length;
}

/** Every answer right, and none of them helped by a hint. */
export function isPerfect(answers: readonly AnswerRecord[]): boolean {
  return answers.length > 0 && answers.every((a) => a.isCorrect && !a.hinted);
}

export function xpForSession(result: SessionResult): number {
  return result.score + (isPerfect(result.answers) ? PERFECT_BONUS_XP : 0);
}
