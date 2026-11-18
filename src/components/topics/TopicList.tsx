'use client';

import { useMemo } from 'react';

import { Ui } from '@/components/ui';

import type { TopicSummary } from '@/content/summaries';
import type { Level } from '@/content/types';
import type { Bilingual } from '@/lib/i18n/copy';
import { useProgress } from '@/hooks/useProgress';
import { masteryFor, type MasteryInfo } from '@/lib/progress/mastery';

import { groupTopics } from './group-order';
import { TopicCard } from './TopicCard';

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

export function TopicList({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();

  const mastery = useMemo(() => {
    if (!progress) return null;
    const map = new Map<string, MasteryInfo>();
    for (const topic of topics)
      map.set(topic.id, masteryFor(progress.topics[topic.id], topic.modes));
    return map;
  }, [progress, topics]);

  return (
    <div className="flex flex-col gap-10">
      {(['A1', 'A2'] as const).map((level) => {
        const levelTopics = topics.filter((t) => t.level === level);
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
                <h3 className="mt-5 mb-1 text-xs font-extrabold tracking-widest text-muted uppercase">
                  <Ui {...label} />
                </h3>
                <ul className="border-t-2 border-ink">
                  {items.map((topic) => (
                    <li key={topic.id} className="border-b-2 border-ink">
                      <TopicCard
                        topic={topic}
                        index={topics.indexOf(topic) + 1}
                        mastery={mastery?.get(topic.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
