/**
 * Turns a missed question into a study card: the correct form, other correct forms,
 * and a few examples from the same topic that follow the same pattern.
 */

import type { GapQuestion, Question, SortQuestion, Topic } from '@/content/types';

import { formatSentence } from '../game/check-answer';

const MAX_EXAMPLES = 3;
const MAX_ALSO_CORRECT = 3;
const ARTICLE = /^(der|die|das|den|dem|des)$/i;

export interface ReviseCard {
  questionId: string;
  topicId: string;
  /** The question answered correctly, e.g. "die Wohnung" or a full sentence. */
  correct: string;
  /** English gloss or translation, when the question has one. */
  translation?: string;
  explanation: string;
  /** Other word orders that are also right (sentence builders). */
  alsoCorrect: string[];
  /** Other items in the topic with the same answer, so the pattern is visible. */
  examples: string[];
}

function sortCorrect(question: SortQuestion): string {
  if (question.prompt.includes('___')) return question.prompt.replace('___', question.answer);
  if (ARTICLE.test(question.answer)) return `${question.answer} ${question.prompt}`;
  return `${question.prompt} → ${question.answer}`;
}

function gapCorrect(question: GapQuestion): string {
  return `${question.before}${question.answer}${question.after}`;
}

/** The question with its right answer filled in. */
export function correctForm(question: Question): string {
  switch (question.kind) {
    case 'sort':
      return sortCorrect(question);
    case 'gap':
      return gapCorrect(question);
    case 'build':
      return formatSentence(question.tiles, question.punctuation);
    /* v8 ignore next 4 -- exhaustive: the type system proves this is unreachable */
    default: {
      const exhaustive: never = question;
      throw new Error(`Unknown question kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}

function sameAnswerExamples(topic: Topic, question: SortQuestion | GapQuestion): string[] {
  const pool: Question[] =
    question.kind === 'sort' ? (topic.sort?.questions ?? []) : (topic.gap ?? []);
  return pool
    .filter(
      (other) =>
        other.id !== question.id &&
        other.kind === question.kind &&
        other.answer === question.answer,
    )
    .slice(0, MAX_EXAMPLES)
    .map(correctForm);
}

export function buildReviseCard(topic: Topic, question: Question): ReviseCard {
  const base = {
    questionId: question.id,
    topicId: topic.id,
    correct: correctForm(question),
    explanation: question.explanation,
  };
  switch (question.kind) {
    case 'sort':
      return {
        ...base,
        translation: question.gloss,
        alsoCorrect: [],
        examples: sameAnswerExamples(topic, question),
      };
    case 'gap':
      return {
        ...base,
        translation: question.translation,
        alsoCorrect: [],
        examples: sameAnswerExamples(topic, question),
      };
    case 'build':
      return {
        ...base,
        translation: question.translation,
        alsoCorrect: (question.accepted ?? [])
          .slice(0, MAX_ALSO_CORRECT)
          .map((order) => formatSentence(order, question.punctuation)),
        examples: [],
      };
    /* v8 ignore next 4 -- exhaustive: the type system proves this is unreachable */
    default: {
      const exhaustive: never = question;
      throw new Error(`Unknown question kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/** Find a question by id across topics. Returns undefined for retired questions. */
export function findQuestion(
  topics: readonly Topic[],
  topicId: string,
  questionId: string,
): { topic: Topic; question: Question } | undefined {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return undefined;
  const question = [
    ...(topic.sort?.questions ?? []),
    ...(topic.gap ?? []),
    ...(topic.build ?? []),
  ].find((q) => q.id === questionId);
  return question ? { topic, question } : undefined;
}
