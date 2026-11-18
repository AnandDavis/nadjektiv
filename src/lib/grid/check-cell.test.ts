import { describe, expect, it } from 'vitest';

import { isCellCorrect, normaliseAnswer } from './check-cell';

describe('isCellCorrect', () => {
  it('ignores case and surrounding or repeated spaces', () => {
    expect(isCellCorrect({ answer: 'Ihnen' }, 'ihnen')).toBe(true);
    expect(isCellCorrect({ answer: 'steht auf' }, '  steht   auf ')).toBe(true);
  });

  it('accepts endings with or without their hyphen', () => {
    expect(isCellCorrect({ answer: '-en' }, 'en')).toBe(true);
    expect(isCellCorrect({ answer: '-en' }, '-en')).toBe(true);
    expect(isCellCorrect({ answer: '-en' }, '-e')).toBe(false);
  });

  it('accepts listed alternatives', () => {
    const cell = { answer: 'am kleinsten', accepted: ['kleinsten'] };
    expect(isCellCorrect(cell, 'kleinsten')).toBe(true);
    expect(isCellCorrect(cell, 'am kleinsten')).toBe(true);
  });

  it('never accepts ae for ä or ss for ß', () => {
    expect(isCellCorrect({ answer: 'fährt' }, 'faehrt')).toBe(false);
    expect(isCellCorrect({ answer: 'weiß' }, 'weiss')).toBe(false);
    expect(isCellCorrect({ answer: 'fährt' }, 'fährt')).toBe(true);
  });

  it('treats empty input as wrong', () => {
    expect(isCellCorrect({ answer: 'den' }, '   ')).toBe(false);
  });

  it('normalises composed and decomposed umlauts the same', () => {
    expect(normaliseAnswer('fährt')).toBe(normaliseAnswer('fährt'));
  });
});
