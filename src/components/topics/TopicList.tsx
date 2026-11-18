'use client';

import { useMemo } from 'react';

import type { TopicSummary } from '@/content/summaries';
import type { Level } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { masteryFor, type MasteryInfo } from '@/lib/progress/mastery';

import { groupTopics } from './group-order';
import { TopicCard } from './TopicCard';

const LEVEL_INTROS: Record<Level, string> = {
  A1: 'The foundations: articles, cases, the present and the Perfekt.',
  A2: 'Building on A1: endings, the past, and longer sentences.',
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
    <div className="flex flex-col gap-8">
      {(['A1', 'A2'] as const).map((level) => {
        const levelTopics = topics.filter((t) => t.level === level);
        return (
          <section key={level} aria-labelledby={`level-${level}`}>
            <h2 id={`level-${level}`} className="font-display text-2xl font-bold text-ink">
              {level}
            </h2>
            <p className="mb-3 text-sm text-muted">{LEVEL_INTROS[level]}</p>
            {groupTopics(levelTopics).map(({ group, label, items }) => (
              <div key={group} className="mb-4">
                <h3 className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">
                  {label}
                </h3>
                <ul className="flex flex-col gap-3">
                  {items.map((topic) => (
                    <li key={topic.id}>
                      <TopicCard topic={topic} mastery={mastery?.get(topic.id)} />
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
