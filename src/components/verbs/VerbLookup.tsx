'use client';

import { useMemo, useState } from 'react';

import { SearchField, Ui } from '@/components/ui';
import { PRESENT_PERSONS } from '@/content/verbs';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { searchVerbs, type VerbEntry } from '@/lib/verbs/lookup';

import { TopicLink } from '../topics/TopicLink';

interface VerbLookupProps {
  verbs: VerbEntry[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

const LABEL = 'text-xs font-extrabold tracking-widest text-muted uppercase';

/** Search the irregular verbs and see each one's forms together. */
export function VerbLookup({ verbs, topicTitles }: VerbLookupProps) {
  const [language] = useUiLanguage();
  const [query, setQuery] = useState('');
  const matches = useMemo(() => searchVerbs(verbs, query), [verbs, query]);

  return (
    <div className="flex flex-col gap-4">
      <div role="search">
        <SearchField
          value={query}
          onChange={setQuery}
          label={COPY.verbs.searchLabel[language]}
          placeholder={COPY.verbs.searchPlaceholder[language]}
          clearLabel={COPY.search.clear[language]}
        />
      </div>
      <p aria-live="polite" className={LABEL}>
        {matches.length === 0 && <Ui {...COPY.verbs.noResults} />}
      </p>
      <ul className="border-t-4 border-ink">
        {matches.map((verb) => (
          <li key={verb.infinitive} className="border-b-2 border-line py-5">
            <Verb verb={verb} topicTitles={topicTitles} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function kinds(verb: VerbEntry): Bilingual[] {
  return [
    COPY.verbs[verb.kind],
    ...(verb.separable ? [COPY.verbs.separable] : []),
    ...(verb.dative ? [COPY.verbs.dative] : []),
  ];
}

function Verb({
  verb,
  topicTitles,
}: {
  verb: VerbEntry;
  topicTitles: VerbLookupProps['topicTitles'];
}) {
  const aux = verb.auxiliary === 'sein' ? ['bin', 'ist'] : ['habe', 'hat'];
  return (
    <article aria-labelledby={`verb-${verb.infinitive}`} className="flex flex-col gap-3">
      <header>
        <h2
          id={`verb-${verb.infinitive}`}
          lang="de"
          className="text-2xl leading-tight font-black text-ink"
        >
          {verb.infinitive}
        </h2>
        <p className="text-sm font-extrabold tracking-wide text-muted uppercase">{verb.gloss}</p>
        <p className="mt-1 text-xs font-bold text-muted">
          {kinds(verb).map((kind, i) => (
            <span key={i}>
              {i > 0 && ' · '}
              <Ui {...kind} />
            </span>
          ))}
        </p>
      </header>
      {verb.note && <p className="text-sm text-ink">{verb.note}</p>}

      <div>
        <h3 className={LABEL}>
          <Ui {...COPY.verbs.present} />
        </h3>
        {/* Singular on the left, plural on the right. */}
        <dl className="mt-1 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-4 border-2 border-ink px-3 py-2">
          {PRESENT_PERSONS.map((person, i) => (
            <div key={person} className="flex flex-wrap gap-x-1.5">
              <dt lang="de" className="text-muted">
                {person}
              </dt>
              <dd lang="de" className="font-bold text-ink">
                {verb.present[i]}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className={LABEL}>
            <Ui {...COPY.verbs.praeteritum} />
          </h3>
          <p lang="de" className="mt-1 text-ink">
            ich/er <strong>{verb.praeteritum}</strong>
          </p>
        </div>
        <div>
          <h3 className={LABEL}>
            <Ui {...COPY.verbs.perfekt} />
          </h3>
          <p lang="de" className="mt-1 text-ink">
            ich {aux[0]} <strong>{verb.participle}</strong>
            <br />
            er {aux[1]} <strong>{verb.participle}</strong>
          </p>
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className={LABEL}>
          <Ui {...COPY.glossary.topics} />
        </span>
        {verb.topicIds.map((id) => (
          <TopicLink
            key={id}
            topicId={id}
            origin="verbs"
            className="inline-flex min-h-11 items-center font-semibold text-brand-strong underline underline-offset-4"
          >
            {topicTitles[id] ? <Ui {...topicTitles[id]} /> : id}
          </TopicLink>
        ))}
      </p>
    </article>
  );
}
