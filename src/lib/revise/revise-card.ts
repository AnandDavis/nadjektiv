/**
 * Turns a missed question into a study card: the correct form, other correct forms,
 * and a few examples from the same topic that follow the same pattern.
 */

import type { GapQuestion, GridPuzzle, Question, SortQuestion, Topic } from '@/content/types';

import { formatSentence } from '../game/check-answer';
import { parseCellId } from '../grid/grid-round';

const MAX_EXAMPLES = 3;
const MAX_ALSO_CORRECT = 3;
const ARTICLE = /^(der|die|das|den|dem|des)$/i;

/** A piece of the correct form; `isAnswer` marks the part the question asked for. */
export interface CorrectPart {
  text: string;
  isAnswer: boolean;
}

export interface ReviseCard {
  questionId: string;
  topicId: string;
  /** The question answered correctly, e.g. "die Wohnung" or a full sentence. */
  correct: string;
  /**
   * `correct` split around the answer, to underline it. Absent for sentence builders,
   * where the whole order is the answer and the words out of place are compared instead.
   */
  correctParts?: CorrectPart[];
  /** English gloss or translation, when the question has one. */
  translation?: string;
  explanation: string;
  /** Other word orders that are also right (sentence builders). */
  alsoCorrect: string[];
  /** Other items in the topic with the same answer, so the pattern is visible. */
  examples: string[];
  /** What `examples` shows: other items with the same answer, or the cell's whole table row. */
  examplesKind?: 'sameAnswer' | 'row';
}

const answer = (text: string): CorrectPart => ({ text, isAnswer: true });
const plain = (text: string): CorrectPart => ({ text, isAnswer: false });

function sortParts(question: SortQuestion): CorrectPart[] {
  if (question.prompt.includes('___')) {
    const [before, after] = question.prompt.split('___');
    return [plain(before), answer(question.answer), plain(after)];
  }
  if (ARTICLE.test(question.answer)) return [answer(question.answer), plain(` ${question.prompt}`)];
  return [plain(`${question.prompt} → `), answer(question.answer)];
}

function gapParts(question: GapQuestion): CorrectPart[] {
  return [plain(question.before), answer(question.answer), plain(question.after)];
}

const joinParts = (parts: readonly CorrectPart[]) => parts.map((p) => p.text).join('');

function sortCorrect(question: SortQuestion): string {
  return joinParts(sortParts(question));
}

function gapCorrect(question: GapQuestion): string {
  return joinParts(gapParts(question));
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
        correctParts: sortParts(question).filter((part) => part.text !== ''),
        alsoCorrect: [],
        examples: sameAnswerExamples(topic, question),
      };
    case 'gap':
      return {
        ...base,
        translation: question.translation,
        correctParts: gapParts(question).filter((part) => part.text !== ''),
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

/** A missed grid cell as a study card: the cell, the rule, and its whole row. */
export function buildGridCellCard(
  topic: Topic,
  grid: GridPuzzle,
  row: number,
  col: number,
): ReviseCard | undefined {
  const gridRow = grid.rows[row];
  const cell = gridRow?.cells[col];
  if (!gridRow || !cell) return undefined;
  return {
    questionId: `${grid.id}:${row}:${col}`,
    topicId: topic.id,
    correct: `${gridRow.label} · ${grid.columns[col]}: ${cell.answer}`,
    correctParts: [plain(`${gridRow.label} · ${grid.columns[col]}: `), answer(cell.answer)],
    translation: grid.title,
    explanation: grid.explanation,
    alsoCorrect: [],
    examples: [`${gridRow.label}: ${gridRow.cells.map((c) => c.answer).join(' · ')}`],
    examplesKind: 'row',
  };
}

/** The study card for any revise-list id: a question or a grid cell. */
export function reviseCardFor(
  topics: readonly Topic[],
  topicId: string,
  id: string,
): ReviseCard | undefined {
  const found = findQuestion(topics, topicId, id);
  if (found) return buildReviseCard(found.topic, found.question);
  const cell = parseCellId(id);
  const topic = topics.find((t) => t.id === topicId);
  const grid = cell && topic?.grids?.find((g) => g.id === cell.gridId);
  return grid && topic ? buildGridCellCard(topic, grid, cell.row, cell.col) : undefined;
}
