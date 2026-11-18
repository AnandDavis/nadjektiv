import { describe, expect, it } from 'vitest';

import { getTopic } from '@/content';
import type { GapQuestion, SortQuestion } from '@/content/types';
import { createEmptyProgress } from '@/lib/progress/types';

import { nounOf, nounToReveal, withSeenNoun } from './reveal';

const sort = (prompt: string, answer: string): SortQuestion => ({
  id: 'noun-gender-sort-1',
  kind: 'sort',
  prompt,
  answer,
  explanation: '',
});

describe('nounOf', () => {
  it('finds the noun behind a gender prompt or a noun card', () => {
    expect(nounOf(sort('Wohnung', 'die'))).toMatchObject({ gender: 'die', plural: 'Wohnungen' });
    const card = getTopic('noun-cards')!.gap![0];
    expect(nounOf(card)).toMatchObject({ word: 'Tisch', plural: 'Tische' });
  });

  it('ignores prompts that aren’t a noun’s gender, and other questions', () => {
    expect(nounOf(sort('Wohnung', 'den'))).toBeUndefined();
    expect(nounOf(sort('Unbekannt', 'die'))).toBeUndefined();
    expect(nounOf(getTopic('articles')!.gap![0] as GapQuestion)).toBeUndefined();
  });
});

describe('nounToReveal', () => {
  it('introduces a noun once, and never one the learner has already practised', () => {
    const question = sort('Wohnung', 'die');
    const fresh = createEmptyProgress();
    expect(nounToReveal(question, fresh)?.word).toBe('Wohnung');

    const met = withSeenNoun(fresh, 'Wohnung');
    expect(nounToReveal(question, met)).toBeUndefined();
    expect(withSeenNoun(met, 'Wohnung')).toBe(met);

    const practised = { ...fresh, questions: { [question.id]: { seen: 2, correct: 1 } } };
    expect(nounToReveal(question, practised)).toBeUndefined();
  });
});
