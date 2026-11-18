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

/** Compare a learner's sentence with one correct sentence, word by word. */
export function diffSentences(given: string, correct: string): WordDiff {
  const a = words(given);
  const b = words(correct);
  const { inA, inB } = lcs(a, b);
  return {
    given: a.map((text, i) => ({ text, isRight: inA.has(i) })),
    answer: b.map((text, j) => ({ text, isRight: inB.has(j) })),
  };
}

/**
 * Compare a learner's sentence (as shown: "Als ich ein Kind war ich habe …") with the
 * correct order it is closest to, word by word.
 */
export function diffBuiltSentence(question: BuildQuestion, given: string): WordDiff {
  const givenWords = words(given);
  const orders = [question.tiles, ...(question.accepted ?? [])].map((order) =>
    words(formatSentence(order, question.punctuation)),
  );
  let best = { order: orders[0], ...lcs(givenWords, orders[0]) };
  for (const order of orders.slice(1)) {
    const candidate = { order, ...lcs(givenWords, order) };
    if (candidate.inA.size > best.inA.size) best = candidate;
  }
  return {
    given: givenWords.map((text, i) => ({ text, isRight: best.inA.has(i) })),
    answer: best.order.map((text, j) => ({ text, isRight: best.inB.has(j) })),
  };
}
