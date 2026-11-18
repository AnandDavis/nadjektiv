/**
 * The shape system: blue ■, red ●, yellow ▲. Each pairing means one thing everywhere,
 * so learners connect der with a blue square, Blitz with a yellow triangle, and so on.
 */

import type { GameMode } from '@/content/types';

export type ShapeKind = 'square' | 'circle' | 'triangle';
export type ShapeColor = 'blue' | 'red' | 'yellow' | 'ink';

export interface ShapeSpec {
  kind: ShapeKind;
  color: ShapeColor;
}

const GENDER_SHAPES: Record<string, ShapeSpec> = {
  der: { kind: 'square', color: 'blue' },
  die: { kind: 'circle', color: 'red' },
  das: { kind: 'triangle', color: 'yellow' },
};

/** The shape for der/die/das (any capitalisation), or undefined for other words. */
export function genderShape(word: string): ShapeSpec | undefined {
  return GENDER_SHAPES[word.toLowerCase()];
}

export const MODE_SHAPES: Record<GameMode, ShapeSpec> = {
  sort: { kind: 'triangle', color: 'yellow' },
  gap: { kind: 'square', color: 'blue' },
  build: { kind: 'circle', color: 'red' },
};
