/**
 * Hints: the question's own explanation with the answer blanked out, so the hint
 * points at the rule ("feminine Akkusativ is ___") without giving the answer away.
 * Built from checked content rather than written separately, so a hint can't teach
 * something the explanation doesn't. Blitz has no hints.
 */

import type { Question } from '@/content/types';

import { formatSentence, wordsOf } from './check-answer';

export const HINT_BLANK = '___';

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Blank every whole-word occurrence of `phrase`, ignoring case. */
function blank(text: string, phrase: string): string {
  const pattern = new RegExp(`(?<!\\p{L})${escape(phrase)}(?!\\p{L})`, 'giu');
  return text.replace(pattern, HINT_BLANK);
}

export function hintFor(question: Question): string | undefined {
  switch (question.kind) {
    case 'sort':
      return undefined;
    case 'gap':
      return blank(question.explanation, question.answer);
    case 'build': {
      // Never quote the whole answer sentence; naming one word is a fair nudge.
      const sentence = formatSentence(wordsOf(question.tiles), '');
      return blank(question.explanation, sentence);
    }
    /* v8 ignore next 4 -- exhaustive: the type system proves this is unreachable */
    default: {
      const exhaustive: never = question;
      throw new Error(`Unknown question kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}
