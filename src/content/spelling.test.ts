/**
 * Spellcheck of every piece of German the app presents as correct: gap sentences with
 * the answer filled in, sort prompts, sentence-builder orders and rule examples.
 * Distractor options are deliberately wrong and are not checked.
 */

import dictionary from 'dictionary-de';
import nspell from 'nspell';
import { describe, expect, it } from 'vitest';

import { GLOSSARY } from './glossary';
import { NOUNS } from './nouns';
import { TOPICS } from './index';
import { SPELLING_ALLOWLIST } from './spelling-allowlist';

const spell = nspell({ aff: Buffer.from(dictionary.aff), dic: Buffer.from(dictionary.dic) });

const WORD = /\p{L}+/gu;
const MIN_COMPOUND_PART = 3;

function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isKnown(word: string): boolean {
  return (
    spell.correct(word) || spell.correct(capitalise(word)) || spell.correct(word.toLowerCase())
  );
}

/**
 * German writes compounds as one word (Wochenende, Kühlschrank), which nspell can't
 * build. Accept a word that splits into two known words, optionally with a linking -s-.
 */
function isCompound(word: string): boolean {
  for (let i = MIN_COMPOUND_PART; i <= word.length - MIN_COMPOUND_PART; i++) {
    const head = word.slice(0, i);
    const tail = capitalise(word.slice(i));
    const heads = head.endsWith('s') ? [head, head.slice(0, -1)] : [head];
    if (heads.some((h) => h.length >= MIN_COMPOUND_PART && isKnown(h))) {
      if (isKnown(tail) || isCompound(tail)) return true;
    }
  }
  return false;
}

function unknownWords(text: string): string[] {
  // "-er als, am -sten": an ending written with a leading hyphen is notation, not a word.
  const words =
    text
      .replace(/___/g, ' ')
      .replace(/(^|\s)-\p{L}+/gu, ' ')
      .match(WORD) ?? [];
  return words.filter(
    (word) =>
      word.length > 1 && !SPELLING_ALLOWLIST.has(word) && !isKnown(word) && !isCompound(word),
  );
}

function correctTexts(): Array<{ id: string; text: string }> {
  const glossary = GLOSSARY.flatMap((entry) => [
    { id: `glossary ${entry.id}`, text: entry.term },
    { id: `glossary ${entry.id}`, text: entry.example.de },
  ]);
  const nouns = [...NOUNS.values()].map((noun) => ({
    id: `noun ${noun.word}`,
    text: `${noun.word} ${noun.plural ?? ''}`,
  }));
  return [...glossary, ...nouns].concat(
    TOPICS.flatMap((topic) => [
      { id: `${topic.id} title`, text: topic.titleDe },
      ...(topic.grids ?? []).flatMap((grid) => [
        { id: grid.id, text: grid.titleDe },
        ...grid.rows.flatMap((row) =>
          row.cells.flatMap((cell) =>
            [cell.answer, ...(cell.accepted ?? [])].map((text) => ({ id: grid.id, text })),
          ),
        ),
      ]),
      ...(topic.sort?.questions ?? []).map((q) => ({
        id: q.id,
        text: q.prompt.replace('___', q.answer),
      })),
      ...(topic.gap ?? []).map((q) => ({ id: q.id, text: `${q.before}${q.answer}${q.after}` })),
      ...(topic.build ?? []).flatMap((q) =>
        [q.tiles, ...(q.accepted ?? [])].map((order) => ({ id: q.id, text: order.join(' ') })),
      ),
      ...topic.rules.flatMap((rule) =>
        (rule.examples ?? []).map((example) => ({ id: `${topic.id} rules`, text: example.de })),
      ),
    ]),
  );
}

describe('German spellcheck', () => {
  it('knows real words, compounds and allowlisted names, and rejects typos', () => {
    expect(unknownWords('Ich gehe am Wochenende zum Kühlschrank.')).toEqual([]);
    expect(unknownWords('Lena trinkt Kaffee im Café.')).toEqual([]);
    expect(unknownWords('Ich habe das Buch gelsen.')).toEqual(['gelsen']);
    expect(unknownWords('Die Strase ist lang.')).toEqual(['Strase']);
    expect(unknownWords('Vergleichen: -er als, am -sten')).toEqual([]);
  });

  it('finds no misspellings in any correct German in the app', { timeout: 60_000 }, () => {
    const problems = correctTexts().flatMap(({ id, text }) =>
      unknownWords(text).map((word) => `${id}: ${word}`),
    );
    expect(problems).toEqual([]);
  });
});
