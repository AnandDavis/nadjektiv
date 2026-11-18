/**
 * Which words of a built sentence are out of place. The learner's words are compared
 * with the correct order they're closest to; the longest run of words already in the
 * right sequence (a longest common subsequence) is fine, and the rest are marked.
 */

import type { BuildQuestion } from '@/content/types';

import { formatSentence } from './check-answer';

export interface DiffWord {
  text: string;
  /** In the right place relative to the words around it. */
  isRight: boolean;
}

export interface WordDiff {
  given: DiffWord[];
  answer: DiffWord[];
}

const comparable = (word: string) => word.replace(/[.,!?]/g, '').toLowerCase();

/** Indices of the longest common subsequence of `a` and `b`, by comparable text. */
function lcs(a: readonly string[], b: readonly string[]): { inA: Set<number>; inB: Set<number> } {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        comparable(a[i]) === comparable(b[j])
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const inA = new Set<number>();
  const inB = new Set<number>();
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (comparable(a[i]) === comparable(b[j])) {
      inA.add(i++);
      inB.add(j++);
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return { inA, inB };
}

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/**
 * Compare a learner's sentence with whichever of the correct sentences it is closest
 * to (the most words already in order), word by word.
 */
export function diffClosest(given: string, corrects: readonly string[]): WordDiff {
  const a = words(given);
  let best: { b: string[]; inA: Set<number>; inB: Set<number> } | undefined;
  for (const correct of corrects) {
    const b = words(correct);
    const candidate = { b, ...lcs(a, b) };
    if (!best || candidate.inA.size > best.inA.size) best = candidate;
  }
  const { b = [], inA = new Set<number>(), inB = new Set<number>() } = best ?? {};
  return {
    given: a.map((text, i) => ({ text, isRight: inA.has(i) })),
    answer: b.map((text, j) => ({ text, isRight: inB.has(j) })),
  };
}

/** Every correct way to say a built sentence, as shown: the canonical order first. */
export function correctSentences(question: BuildQuestion): string[] {
  return [question.tiles, ...(question.accepted ?? [])].map((order) =>
    formatSentence(order, question.punctuation),
  );
}

/**
 * Compare a learner's sentence (as shown: "Als ich ein Kind war ich habe …") with the
 * correct order it is closest to, word by word.
 */
export function diffBuiltSentence(question: BuildQuestion, given: string): WordDiff {
  return diffClosest(given, correctSentences(question));
}
