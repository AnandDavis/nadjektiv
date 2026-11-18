import { NOUN_CARDS, type NounCard } from '../nouns';
import type { GapQuestion, Topic } from '../types';

/** "der Tisch, die Tische": a noun as it should be learned. */
export function nounPair(gender: string, word: string, plural: string): string {
  return `${gender} ${word}, die ${plural}`;
}

/** One card: the noun, with both its gender and its plural to choose. Ids follow position. */
function cardQuestion(noun: NounCard, index: number): GapQuestion {
  const { word, gender, plural, wrongGender, wrongPlural } = noun;
  return {
    id: `noun-cards-gap-${index + 1}`,
    kind: 'gap',
    before: `${word} → `,
    after: '.',
    options: [
      nounPair(gender, word, plural),
      nounPair(wrongGender, word, plural),
      nounPair(gender, word, wrongPlural),
      nounPair(wrongGender, word, wrongPlural),
    ],
    answer: nounPair(gender, word, plural),
    translation: `the ${noun.gloss}, the ${noun.glossPlural}`,
    explanation: noun.rule,
  };
}

export const nounCards: Topic = {
  id: 'noun-cards',
  level: 'A1',
  group: 'nouns',
  title: 'Article and plural',
  titleDe: 'Artikel und Plural',
  keywords: ['Nomen', 'noun', 'Artikel', 'article', 'Plural', 'Vokabeln', 'vocabulary', 'Karten'],
  tagline: 'der Tisch, die Tische: learn each noun with both.',
  rules: [
    {
      heading: 'Learn the noun as a pair',
      body: 'Neither the gender nor the plural can be worked out for sure, so learn them with the noun from the start: the singular with its article, then the plural with die.',
      examples: [
        { de: 'der Tisch, die Tische', en: 'the table, the tables' },
        { de: 'die Lampe, die Lampen', en: 'the lamp, the lamps' },
        { de: 'das Buch, die Bücher', en: 'the book, the books' },
      ],
    },
    {
      heading: 'The gender points to the plural',
      table: {
        head: ['Singular', 'Plural', 'Example'],
        rows: [
          ['der, one syllable', '-e, often with umlaut', 'der Zug, die Züge'],
          ['die', '-(e)n', 'die Frau, die Frauen'],
          ['das, one syllable', '-er with umlaut, or -e', 'das Haus, die Häuser'],
          ['der/das with -er, -el, -en, -chen', 'no ending', 'das Zimmer, die Zimmer'],
          ['ends in a vowel (not -e), loanwords', '-s', 'das Auto, die Autos'],
        ],
      },
    },
  ],
  gap: NOUN_CARDS.map(cardQuestion),
};
