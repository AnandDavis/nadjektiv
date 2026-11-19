'use client';

import { useMemo, useState } from 'react';

import { SearchField, Ui } from '@/components/ui';
import type { GlossaryEntry } from '@/content/glossary';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { searchGlossary } from '@/lib/glossary/search';
import { COPY, type Bilingual } from '@/lib/i18n/copy';

import { GlossaryList } from './GlossaryList';

interface GlossaryLookupProps {
  entries: readonly GlossaryEntry[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

/** The glossary with a search that filters it in place. */
export function GlossaryLookup({ entries, topicTitles }: GlossaryLookupProps) {
  const [language] = useUiLanguage();
  const [query, setQuery] = useState('');
  const matches = useMemo(() => searchGlossary(entries, query), [entries, query]);

  return (
    <div className="flex flex-col gap-4">
      <div role="search">
        <SearchField
          value={query}
          onChange={setQuery}
          label={COPY.glossary.searchLabel[language]}
          placeholder={COPY.glossary.searchPlaceholder[language]}
          clearLabel={COPY.search.clear[language]}
        />
      </div>
      <p aria-live="polite" className="text-xs font-extrabold tracking-widest text-muted uppercase">
        {matches.length === 0 && <Ui {...COPY.glossary.noResults} />}
      </p>
      <GlossaryList entries={matches} topicTitles={topicTitles} />
    </div>
  );
}
