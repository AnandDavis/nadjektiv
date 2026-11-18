import { describe, expect, it } from 'vitest';

import { NOUN_CARDS, NOUNS } from './nouns';

describe('noun list', () => {
  it('has each noun once, with a wrong gender and plural that differ from the right ones', () => {
    const words = NOUN_CARDS.map((card) => card.word);
    expect(words.filter((word, i) => words.indexOf(word) !== i)).toEqual([]);
    for (const card of NOUN_CARDS) {
      expect(card.wrongGender, card.word).not.toBe(card.gender);
      expect(card.wrongPlural, card.word).not.toBe(card.plural);
      expect(card.rule.length, card.word).toBeGreaterThan(20);
    }
  });

  it('writes every noun and plural with a capital', () => {
    for (const noun of NOUNS.values()) {
      expect(noun.word, noun.word).toMatch(/^\p{Lu}/u);
      if (noun.plural) expect(noun.plural, noun.word).toMatch(/^\p{Lu}/u);
    }
  });
});
