import type { GapQuestion } from '@/content/types';

/**
 * An ending gap: no space before the gap, so the answer is a word ending
 * ("ein gut" + "es" + " Kind"), shown and typed as "-es".
 */
export function isEndingGap(question: GapQuestion): boolean {
  return question.before.length > 0 && !/\s$/.test(question.before);
}
