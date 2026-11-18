import type { BuildQuestion } from '@/content/types';

/** A comma inside a build order: punctuation for display, never a tile to place. */
export const COMMA = ',';

function normalise(tile: string): string {
  return tile.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** The tiles of an order, without its commas. */
export function wordsOf(order: readonly string[]): string[] {
  return order.filter((tile) => tile !== COMMA);
}

function sameWords(candidate: readonly string[], words: readonly string[]): boolean {
  const expected = wordsOf(candidate);
  return (
    expected.length === words.length &&
    expected.every((tile, i) => normalise(tile) === normalise(words[i]))
  );
}

/**
 * The correct order (canonical or accepted, with its commas) that the learner's
 * tiles match, or undefined if none does. Commas in the learner's order are ignored.
 */
export function matchingOrder(
  question: BuildQuestion,
  order: readonly string[],
): readonly string[] | undefined {
  const words = wordsOf(order);
  return [question.tiles, ...(question.accepted ?? [])].find((candidate) =>
    sameWords(candidate, words),
  );
}

/** True when the learner's tile order matches the canonical order or any accepted alternative. */
export function isCorrectOrder(question: BuildQuestion, order: readonly string[]): boolean {
  return matchingOrder(question, order) !== undefined;
}

/** Join tiles into a display sentence: capitalise the first letter, attach commas, add punctuation. */
export function formatSentence(tiles: readonly string[], punctuation: string): string {
  const text = tiles.join(' ').replace(/ ,/g, ',');
  if (text.length === 0) return '';
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}${punctuation}`;
}
