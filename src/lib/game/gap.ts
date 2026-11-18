import type { GapQuestion } from '@/content/types';

/**
 * An ending gap: no space before the gap, so the answer is a word ending
 * ("ein gut" + "es" + " Kind"), shown and typed as "-es".
 */
export function isEndingGap(question: GapQuestion): boolean {
  return question.before.length > 0 && !/\s$/.test(question.before);
}

/** The gap opens a sentence: nothing before it, or a finished sentence. */
export function startsSentence(question: GapQuestion): boolean {
  return /^$|[.!?…]["“”]?\s+$/.test(question.before.trimStart());
}

/** "die" → "Die", for an answer typed at the start of a sentence. */
export function capitaliseFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
