import { describe, expect, it } from 'vitest';

import { TOPICS } from '@/content';
import { createRng } from '@/lib/game/rng';
import { createEmptyProgress } from '@/lib/progress/types';

import {
  EXAM_LENGTH,
  buildExamSession,
  gradeFor,
  levelFromParam,
  weakestTopics,
  withExamResult,
} from './exam';

const a1 = TOPICS.filter((topic) => topic.level === 'A1');
const answer = (topicId: string, isCorrect: boolean) => ({
  questionId: `${topicId}-gap-1`,
  topicId,
  isCorrect,
  given: '',
});

describe('buildExamSession', () => {
  it('asks every topic of the level before any twice, with no repeats', () => {
    const items = buildExamSession(a1, createRng(4));
    expect(items).toHaveLength(EXAM_LENGTH);
    expect(new Set(items.map((i) => i.topicId))).toEqual(new Set(a1.map((t) => t.id)));
    expect(new Set(items.map((i) => i.question.id)).size).toBe(EXAM_LENGTH);
    expect(items.some((i) => i.typed)).toBe(false);
  });

  it('stops when the topics run out of questions', () => {
    const tiny = { ...a1[0], sort: undefined, build: undefined, gap: a1[0].gap!.slice(0, 2) };
    expect(buildExamSession([tiny], createRng(1))).toHaveLength(2);
  });
});

describe('grading', () => {
  it('follows the Goethe bands', () => {
    expect(gradeFor(100)).toBe('sehrGut');
    expect(gradeFor(90)).toBe('sehrGut');
    expect(gradeFor(89)).toBe('gut');
    expect(gradeFor(70)).toBe('befriedigend');
    expect(gradeFor(60)).toBe('ausreichend');
    expect(gradeFor(59)).toBe('nichtBestanden');
  });

  it('reads a level from the URL', () => {
    expect(levelFromParam('a2')).toBe('A2');
    expect(levelFromParam('b1')).toBeUndefined();
  });
});

describe('weakestTopics', () => {
  it('lists topics with mistakes, worst first', () => {
    const answers = [
      answer('cases', true),
      answer('cases', false),
      answer('articles', false),
      answer('plurals', true),
    ];
    expect(weakestTopics(answers)).toEqual(['articles', 'cases']);
  });
});

describe('withExamResult', () => {
  it('keeps the best percentage per level and counts plays', () => {
    const first = withExamResult(createEmptyProgress(), 'A1', 70);
    expect(first).toEqual({ exams: { A1: { plays: 1, bestPercent: 70 } }, isBest: true });
    const worse = withExamResult({ ...createEmptyProgress(), exams: first.exams }, 'A1', 60);
    expect(worse).toEqual({ exams: { A1: { plays: 2, bestPercent: 70 } }, isBest: false });
  });
});
