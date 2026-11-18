/**
 * The "new word" card: the first time a noun comes up in a quiz, show it with its
 * gender and plural before asking, so the learner meets it rather than guesses it.
 */

import { NOUNS, type Noun } from '@/content/nouns';
import type { Question } from '@/content/types';
import type { Progress } from '@/lib/progress/types';

/** The noun a question asks about: a der/die/das sort prompt, or a noun card. */
export function nounOf(question: Question): Noun | undefined {
  if (question.kind === 'sort') {
    const noun = NOUNS.get(question.prompt);
    return noun?.gender === question.answer ? noun : undefined;
  }
  if (question.kind === 'gap' && question.id.startsWith('noun-cards-')) {
    return NOUNS.get(question.before.replace(/\s*→\s*$/, ''));
  }
  return undefined;
}

/**
 * The noun to introduce before this question, if the learner hasn't met it: not seen
 * on a card before, and this question never answered (players from before the card
 * existed already know the nouns they've practised).
 */
export function nounToReveal(question: Question, progress: Progress): Noun | undefined {
  const noun = nounOf(question);
  if (!noun) return undefined;
  if (progress.seenNouns?.includes(noun.word)) return undefined;
  if ((progress.questions[question.id]?.seen ?? 0) > 0) return undefined;
  return noun;
}

/** Remember that the learner has met this noun. */
export function withSeenNoun(progress: Progress, word: string): Progress {
  const seen = progress.seenNouns ?? [];
  return seen.includes(word) ? progress : { ...progress, seenNouns: [...seen, word] };
}
