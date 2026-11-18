import type { BuildQuestion } from '@/content/types';

function normalise(tile: string): string {
  return tile.trim().replace(/\s+/g, ' ').toLowerCase();
}

function sameOrder(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((tile, i) => normalise(tile) === normalise(b[i]));
}

/** True when the learner's tile order matches the canonical order or any accepted alternative. */
export function isCorrectOrder(question: BuildQuestion, order: readonly string[]): boolean {
  const orders = [question.tiles, ...(question.accepted ?? [])];
  return orders.some((candidate) => sameOrder(candidate, order));
}

/** Join tiles into a display sentence: capitalise the first letter and add punctuation. */
export function formatSentence(tiles: readonly string[], punctuation: string): string {
  const text = tiles.join(' ');
  if (text.length === 0) return '';
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}${punctuation}`;
}
