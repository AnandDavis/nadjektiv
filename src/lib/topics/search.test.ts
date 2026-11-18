import { describe, expect, it } from 'vitest';

import { getTopicSummaries } from '@/content/summaries';

import { searchTopics } from './search';

const topics = getTopicSummaries();
const ids = (query: string) => searchTopics(topics, query).map((t) => t.id);

describe('searchTopics', () => {
  it('returns every topic, in order, for an empty query', () => {
    expect(ids('')).toEqual(topics.map((t) => t.id));
    expect(ids('   ')).toHaveLength(topics.length);
  });

  it('finds topics by German or English title, ignoring case', () => {
    expect(ids('Wechselpräpositionen')).toEqual(['two-way-prepositions']);
    expect(ids('two-way')).toContain('two-way-prepositions');
    expect(ids('TRENNBARE')).toEqual(['separable-verbs']);
  });

  it('matches word starts, so partial typing works', () => {
    expect(ids('wechsel')).toEqual(['two-way-prepositions']);
    expect(ids('adj')).toContain('adjective-endings');
  });

  it('ignores umlauts and ß either way', () => {
    for (const query of ['präteritum', 'prateritum', 'praeteritum']) {
      expect(ids(query)).toContain('praeteritum');
    }
    expect(ids('unregelmassig')).toEqual(['irregular-verbs']);
    expect(ids('mussen')).toContain('modal-verbs');
  });

  it('finds topics by keyword, including telltale words', () => {
    expect(ids('dativ')).toEqual(
      expect.arrayContaining(['cases', 'dative-verbs', 'two-way-prepositions']),
    );
    expect(ids('weil')).toEqual(expect.arrayContaining(['word-order', 'connectors']));
    expect(ids('past tense')).toEqual(expect.arrayContaining(['perfekt', 'praeteritum']));
  });

  it('requires every word to match', () => {
    expect(ids('dativ verb')).toContain('dative-verbs');
    expect(ids('dativ verb')).not.toContain('cases');
  });

  it('finds nothing for nonsense', () => {
    expect(ids('xylophon')).toEqual([]);
  });
});
