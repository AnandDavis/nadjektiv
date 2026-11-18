/**
 * The shape system: blue ■, red ●, yellow ▲. Each pairing means one thing everywhere,
 * so learners connect der with a blue square, Blitz with a yellow triangle, and so on.
 */

import type { GameMode } from '@/content/types';

export type ShapeKind = 'square' | 'circle' | 'triangle' | 'grid' | 'bar';
/** `primaries` paints the grid's four squares blue, red, yellow and ink. */
export type ShapeColor = 'blue' | 'red' | 'yellow' | 'violet' | 'ink' | 'primaries';

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
  // Type the answer: a violet text cursor. Every game has a colour of its own.
  type: { kind: 'bar', color: 'violet' },
  // Grid fill: a table of all four Bauhaus colours.
  grid: { kind: 'grid', color: 'primaries' },
};
