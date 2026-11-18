/**
 * Integrity checks over every question bank. A broken answer key teaches the wrong
 * thing, so these run with the unit tests.
 */

import { describe, expect, it } from 'vitest';

import { COMMA, isCorrectOrder, wordsOf } from '@/lib/game/check-answer';
import { availableModes } from '@/lib/game/session';

import { TOPICS } from './index';
import type { BuildQuestion, Question, Topic } from './types';

function questionsOf(topic: Topic): Question[] {
  return [...(topic.sort?.questions ?? []), ...(topic.gap ?? []), ...(topic.build ?? [])];
}

const ALL_QUESTIONS = TOPICS.flatMap((topic) => questionsOf(topic).map((q) => ({ topic, q })));
const sorted = (tiles: readonly string[]) => [...wordsOf(tiles)].sort().join('|');

describe('topic registry', () => {
  it('has unique kebab-case topic ids', () => {
    const ids = TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(TOPICS.map((t) => [t.id, t]))('%s has rules and at least one game mode', (_, topic) => {
    expect(topic.rules.length).toBeGreaterThan(0);
    expect(availableModes(topic).length).toBeGreaterThan(0);
    expect(topic.title.trim()).not.toBe('');
    expect(topic.tagline.trim()).not.toBe('');
  });
});

describe('question ids', () => {
  it('are globally unique', () => {
    const ids = ALL_QUESTIONS.map(({ q }) => q.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it('follow <topic-id>-<mode>-<n>', () => {
    const bad = ALL_QUESTIONS.filter(
      ({ topic, q }) => !new RegExp(`^${topic.id}-${q.kind}-\\d+$`).test(q.id),
    );
    expect(bad.map(({ q }) => q.id)).toEqual([]);
  });
});

describe.each(TOPICS.map((t) => [t.id, t]))('%s', (_, topic) => {
  it('explains every answer', () => {
    const missing = questionsOf(topic).filter((q) => q.explanation.trim().length < 10);
    expect(missing.map((q) => q.id)).toEqual([]);
  });

  if (topic.sort) {
    const { bins, questions } = topic.sort;
    it('sort deck has 2–4 distinct bins and every answer is a bin', () => {
      expect(bins.length).toBeGreaterThanOrEqual(2);
      expect(bins.length).toBeLessThanOrEqual(4);
      expect(new Set(bins).size).toBe(bins.length);
      expect(questions.filter((q) => !bins.includes(q.answer)).map((q) => q.id)).toEqual([]);
    });

    it('sort deck is long enough for a timed round', () => {
      expect(questions.length).toBeGreaterThanOrEqual(20);
    });
  }

  if (topic.gap) {
    it('gap questions have 2–4 distinct options including the answer', () => {
      const bad = topic.gap!.filter(
        (q) =>
          q.options.length < 2 ||
          q.options.length > 4 ||
          new Set(q.options).size !== q.options.length ||
          !q.options.includes(q.answer) ||
          q.translation.trim() === '',
      );
      expect(bad.map((q) => q.id)).toEqual([]);
    });
  }

  if (topic.build) {
    it('build questions have 3–9 tiles and accepted orders reuse the same tiles', () => {
      const bad = topic.build!.filter(
        (q) =>
          wordsOf(q.tiles).length < 3 ||
          wordsOf(q.tiles).length > 9 ||
          (q.accepted ?? []).some((order) => sorted(order) !== sorted(q.tiles)) ||
          !isCorrectOrder(q, q.tiles),
      );
      expect(bad.map((q) => q.id)).toEqual([]);
    });

    it('build tiles have no punctuation glued on; commas are their own entries', () => {
      const orders = (q: BuildQuestion) => [q.tiles, ...(q.accepted ?? [])];
      const bad = topic.build!.filter((q) =>
        orders(q).some(
          (order) =>
            order[0] === COMMA ||
            order[order.length - 1] === COMMA ||
            order.some((tile, i) => tile === COMMA && order[i + 1] === COMMA) ||
            wordsOf(order).some((tile) => /[.,?!]$/.test(tile)),
        ),
      );
      expect(bad.map((q) => q.id)).toEqual([]);
    });
  }
});

describe('German text', () => {
  it('uses real umlauts and ß, not ASCII substitutes in common words', () => {
    const substitutes =
      /\b(fuer|ueber|Strasse|grosse?|muessen|koennen|duerfen|moechte|haette|waere|Maedchen|Baecker)\b/;
    const text = (q: Question) =>
      q.kind === 'sort'
        ? q.prompt
        : q.kind === 'gap'
          ? `${q.before} ${q.options.join(' ')} ${q.after}`
          : q.tiles.join(' ');
    const bad = ALL_QUESTIONS.filter(({ q }) => substitutes.test(text(q)));
    expect(bad.map(({ q }) => q.id)).toEqual([]);
  });
});
