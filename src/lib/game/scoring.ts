/**
 * Points, combos and XP for a game round.
 */

import type { GameMode } from '@/content/types';

export const POINTS_PER_CORRECT = 10;
/** Every COMBO_STEP correct answers in a row raises the multiplier by one. */
export const COMBO_STEP = 5;
export const MAX_MULTIPLIER = 3;
export const PERFECT_BONUS_XP = 50;

export interface AnswerRecord {
  questionId: string;
  topicId: string;
  isCorrect: boolean;
}

/** Score for a whole round, ready to be applied to progress. */
export interface SessionResult {
  /** Undefined for mixed review sessions, which don't set personal bests. */
  topicId?: string;
  mode: GameMode | 'review';
  answers: AnswerRecord[];
  score: number;
  bestCombo: number;
}

export function comboMultiplier(combo: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(combo / COMBO_STEP));
}

/** Points for a correct answer given the combo *before* this answer. */
export function pointsForCorrect(comboBefore: number): number {
  return POINTS_PER_CORRECT * comboMultiplier(comboBefore + 1);
}

export function accuracy(answers: readonly AnswerRecord[]): number {
  if (answers.length === 0) return 0;
  return answers.filter((a) => a.isCorrect).length / answers.length;
}

export function isPerfect(answers: readonly AnswerRecord[]): boolean {
  return answers.length > 0 && answers.every((a) => a.isCorrect);
}

export function xpForSession(result: SessionResult): number {
  return result.score + (isPerfect(result.answers) ? PERFECT_BONUS_XP : 0);
}
