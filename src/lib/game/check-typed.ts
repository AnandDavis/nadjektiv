/**
 * Type the answer: checking what the learner typed into a gap. Forgiving about case,
 * spacing and the hyphen on endings (see normaliseAnswer); strict about spelling, so
 * "ae" never counts for "ä" and "ss" never for "ß". One slip is "nearly", still wrong,
 * unless what was typed is another of the question's options: "den" for "dem" is a
 * wrong case, not a typo, and must read as plainly wrong.
 */

import type { GapQuestion } from '@/content/types';
import { normaliseAnswer } from '@/lib/grid/check-cell';

export type TypedVerdict = 'correct' | 'nearly' | 'wrong';

/**
 * Edits (insert, delete, substitute, or swap two neighbours) between two strings,
 * stopping early once it is clear the answer is more than `limit` edits away.
 */
export function editDistance(a: string, b: string, limit = Infinity): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let prevPrev: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, prevPrev[j - 2] + 1);
      }
      row.push(best);
      rowMin = Math.min(rowMin, best);
    }
    if (rowMin > limit) return limit + 1;
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

/** Commas don't count when typing: "der Tisch die Tische" is "der Tisch, die Tische". */
function typedForm(text: string): string {
  return normaliseAnswer(text.replace(/,/g, ' '));
}

export function checkTyped(question: GapQuestion, typed: string): TypedVerdict {
  const attempt = typedForm(typed);
  const answer = typedForm(question.answer);
  if (attempt === answer) return 'correct';
  if (attempt === '') return 'wrong';
  if (question.options.some((option) => typedForm(option) === attempt)) return 'wrong';
  return editDistance(attempt, answer, 1) === 1 ? 'nearly' : 'wrong';
}

function wordBag(text: string): string {
  return normaliseAnswer(text.replace(/[.,!?]/g, ''))
    .split(' ')
    .sort()
    .join(' ');
}

/**
 * Whether a gap question works typed. Not when every option is the same words in a
 * different order (word-order questions: you can't recall words you weren't shown),
 * and not for digital times, which can be written too many ways.
 */
export function isTypeable(question: GapQuestion): boolean {
  if (/\d/.test(question.answer)) return false;
  const bags = new Set(question.options.map(wordBag));
  return !(question.options.length > 1 && bags.size === 1);
}
