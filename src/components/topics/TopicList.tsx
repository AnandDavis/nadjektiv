'use client';

import { useMemo, useState } from 'react';

import { DailyCallout } from '@/components/progress/DailyCallout';
import { Button, SearchField, Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import type { Level } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { useUiLanguage } from '@/hooks/useUiLanguage';
import { COPY, topicCount, type Bilingual } from '@/lib/i18n/copy';
import { masteryFor, type MasteryInfo } from '@/lib/progress/mastery';
import { searchTopics } from '@/lib/topics/search';

import { ExamLink } from './ExamLink';
import { groupTopics } from './group-order';
import { TopicCard } from './TopicCard';

const LEVELS: readonly Level[] = ['A1', 'A2'];

const LEVEL_INTROS: Record<Level, Bilingual> = {
  A1: {
    de: 'Die Grundlagen: Artikel, Fälle, Präsens und Perfekt.',
    en: 'The foundations: articles, cases, the present and the Perfekt.',
  },
  A2: {
    de: 'Aufbauend auf A1: Endungen, Vergangenheit und längere Sätze.',
    en: 'Building on A1: endings, the past, and longer sentences.',
  },
};

/** The numbered topic index, with search that filters it in place. */
export function TopicList({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();
  const [language] = useUiLanguage();
  const [query, setQuery] = useState('');

  const mastery = useMemo(() => {
    if (!progress) return null;
    const map = new Map<string, MasteryInfo>();
    for (const topic of topics) {
      map.set(topic.id, masteryFor(progress.topics[topic.id], topic.modes));
    }
    return map;
  }, [progress, topics]);

  const matches = useMemo(() => searchTopics(topics, query), [topics, query]);
  const isSearching = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {/* Once today's mix is done it shrinks to a line here, out of the way. */}
        <DailyCallout show="done" />
        <div role="search">
          <SearchField
            value={query}
            onChange={setQuery}
            label={COPY.search.label[language]}
            placeholder={COPY.search.placeholder[language]}
            clearLabel={COPY.search.clear[language]}
          />
          <p
            aria-live="polite"
            className="mt-2 text-xs font-extrabold tracking-widest text-muted uppercase"
          >
            {isSearching && <Ui {...topicCount(matches.length)} />}
          </p>
        </div>
      </div>

      {isSearching && matches.length === 0 && (
        <div className="flex flex-col items-start gap-3 border-2 border-ink bg-surface p-4">
          <p className="text-xl font-black text-ink uppercase">
            <Ui {...COPY.search.noResults} />
          </p>
          <p className="text-sm text-ink">
            <Ui {...COPY.search.noResultsHint} />
          </p>
          <Button variant="secondary" onClick={() => setQuery('')}>
            <Ui {...COPY.search.showAll} />
          </Button>
        </div>
      )}

      {LEVELS.map((level) => {
        const levelTopics = matches.filter((t) => t.level === level);
        if (levelTopics.length === 0) return null;
        return (
          <section key={level} aria-labelledby={`level-${level}`}>
            <div className="flex items-end gap-3 border-b-4 border-ink pb-2">
              <h2
                id={`level-${level}`}
                className="text-6xl leading-none font-black tracking-tighter text-ink"
              >
                {level}
              </h2>
              <p className="pb-1 text-sm leading-snug text-muted">
                <Ui {...LEVEL_INTROS[level]} />
              </p>
            </div>
            {groupTopics(levelTopics).map(({ group, label, items }) => (
              <div key={group}>
                <h3 className="mt-10 mb-2 text-xs font-extrabold tracking-widest text-muted uppercase">
                  <Ui {...label} />
                </h3>
                <ul className="border-t-2 border-line">
                  {items.map((topic) => (
                    <li key={topic.id} className="border-b-2 border-line">
                      <TopicCard
                        topic={topic}
                        index={topics.indexOf(topic) + 1}
                        mastery={mastery?.get(topic.id)}
                        // The home page stays alive in the background, so without this
                        // the search would still be filtering when the learner returns.
                        onOpen={() => setQuery('')}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {!isSearching && <ExamLink level={level} />}
          </section>
        );
      })}
    </div>
  );
}
