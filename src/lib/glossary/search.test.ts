import { describe, expect, it } from 'vitest';

import { GLOSSARY } from '@/content/glossary';

import { searchGlossary } from './search';

const terms = (query: string) => searchGlossary(GLOSSARY, query).map((e) => e.term);

describe('searchGlossary', () => {
  it('returns every entry for an empty query', () => {
    expect(searchGlossary(GLOSSARY, '  ')).toHaveLength(GLOSSARY.length);
  });

  it('finds an entry by its German term or English name', () => {
    expect(terms('akk')).toContain('Akkusativ');
    expect(terms('accusative')).toContain('Akkusativ');
    expect(terms('gender')).toEqual(['Genus']);
  });

  it('ignores case and umlaut spelling', () => {
    const umlaut = GLOSSARY.find((e) => /[äöü]/i.test(e.term));
    if (!umlaut) throw new Error('expected a term with an umlaut');
    const plain = umlaut.term
      .toLowerCase()
      .replace(/[äöü]/g, (c) => ({ ä: 'a', ö: 'o', ü: 'u' })[c]!);
    expect(terms(plain)).toContain(umlaut.term);
  });

  it('finds nothing for an unknown word', () => {
    expect(terms('xyzzy')).toEqual([]);
  });
});
