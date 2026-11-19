/**
 * Where the right answer sits in a question, so the round review can mark it in place
 * and show the learner's answer directly under it.
 */

import type { Question } from '@/content/types';

import { formatSentence } from './check-answer';

export interface AnswerInContext {
  before: string;
  answer: string;
  after: string;
}

export function answerInContext(question: Question): AnswerInContext {
  switch (question.kind) {
    case 'gap':
      return { before: question.before, answer: question.answer, after: question.after };
    case 'sort': {
      const slot = question.prompt.indexOf('___');
      if (slot === -1)
        return { before: `${question.prompt} → `, answer: question.answer, after: '' };
      return {
        before: question.prompt.slice(0, slot),
        answer: question.answer,
        after: question.prompt.slice(slot + 3),
      };
    }
    case 'build':
      return {
        before: '',
        answer: formatSentence(question.tiles, question.punctuation),
        after: '',
      };
    default: {
      const exhaustive: never = question;
      return exhaustive;
    }
  }
}
