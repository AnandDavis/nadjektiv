import { describe, expect, it } from 'vitest';

import { GLOSSARY } from '@/content/glossary';

import { glossaryParts, termMatchers } from './link-terms';

const matchers = termMatchers(GLOSSARY);
const linked = (text: string) =>
  glossaryParts(text, matchers)
    .filter((p) => p.id)
    .map((p) => [p.text, p.id]);

describe('glossaryParts', () => {
  it('links German terms and English aliases, whole words only', () => {
    expect(linked('mit takes the dative; the Akkusativ is for den.')).toEqual([
      ['dative', 'dativ'],
      ['Akkusativ', 'akkusativ'],
    ]);
    expect(linked('Dativverben and indicative moods')).toEqual([]);
  });

  it('prefers the longest term and links each term once', () => {
    expect(linked('A two-way preposition, then another two-way preposition.')).toEqual([
      ['two-way preposition', 'wechselpraeposition'],
    ]);
    expect(linked('The modal verb sends the verb to the end.')).toEqual([
      ['modal verb', 'modalverb'],
    ]);
  });

  it('keeps the text intact around the links', () => {
    const text = 'Perfekt: haben plus the past participle.';
    expect(
      glossaryParts(text, matchers)
        .map((p) => p.text)
        .join(''),
    ).toBe(text);
  });
});
