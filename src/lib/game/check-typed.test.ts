import { describe, expect, it } from 'vitest';

import type { GapQuestion } from '@/content/types';

import { checkTyped, editDistance, isTypeable } from './check-typed';

function gap(answer: string, options: string[] = [answer, 'x']): GapQuestion {
  return {
    id: 't-gap-1',
    kind: 'gap',
    before: 'Ich sehe ',
    after: '.',
    options,
    answer,
    translation: '',
    explanation: '',
  };
}

describe('checkTyped', () => {
  it('ignores case, surrounding and doubled spaces, and a hyphen on endings', () => {
    expect(checkTyped(gap('den'), '  DEN ')).toBe('correct');
    expect(checkTyped(gap('halb acht'), 'halb   Acht')).toBe('correct');
    expect(checkTyped(gap('es'), '-es')).toBe('correct');
  });

  it('never accepts ae for ä or ss for ß, even as nearly', () => {
    expect(checkTyped(gap('Mädchen'), 'Maedchen')).toBe('wrong');
    expect(checkTyped(gap('groß'), 'gross')).toBe('wrong');
  });

  it('calls one slip nearly: a missing, extra, wrong or swapped letter', () => {
    expect(checkTyped(gap('Mädchen'), 'Madchen')).toBe('nearly');
    expect(checkTyped(gap('dem'), 'deem')).toBe('nearly');
    expect(checkTyped(gap('dem'), 'den')).toBe('nearly');
    expect(checkTyped(gap('gegessen'), 'gegesesn')).toBe('nearly');
  });

  it('calls another option plainly wrong, however close: a wrong case is not a typo', () => {
    expect(checkTyped(gap('dem', ['dem', 'den', 'der']), 'den')).toBe('wrong');
    expect(checkTyped(gap('es', ['e', 'en', 'er', 'es']), 'en')).toBe('wrong');
    expect(checkTyped(gap('dem', ['dem', 'den', 'der']), 'dme')).toBe('nearly');
  });

  it('calls anything further off, or nothing, wrong', () => {
    expect(checkTyped(gap('dem'), 'der Mann')).toBe('wrong');
    expect(checkTyped(gap('dem'), '   ')).toBe('wrong');
  });
});

describe('editDistance', () => {
  it('counts edits, and stops early beyond the limit', () => {
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('ab', 'ba')).toBe(1);
    expect(editDistance('a', 'abcdef', 1)).toBe(2);
    expect(editDistance('abcdef', 'uvwxyz', 1)).toBe(2);
  });
});

describe('isTypeable', () => {
  it('keeps word and ending gaps', () => {
    expect(isTypeable(gap('dem', ['dem', 'den', 'der']))).toBe(true);
    expect(isTypeable(gap('halb acht', ['halb acht', 'halb sieben']))).toBe(true);
  });

  it('drops word-order choices and digital times', () => {
    expect(isTypeable(gap('gehe ich', ['gehe ich', 'ich gehe']))).toBe(false);
    expect(
      isTypeable(
        gap('Nehmen Sie bitte Platz!', ['Nehmen Sie bitte Platz!', 'Sie bitte Platz nehmen!']),
      ),
    ).toBe(false);
    expect(isTypeable(gap('7:30', ['7:30', '8:30']))).toBe(false);
  });
});
