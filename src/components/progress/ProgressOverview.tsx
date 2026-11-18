'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { Card, ProgressBar, Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import { useProgress } from '@/hooks/useProgress';
import { MODE_INFO } from '@/lib/game/modes';
import { TIERS, TIER_LABELS, masteryFor } from '@/lib/progress/mastery';
import { summariseProgress } from '@/lib/progress/summary';

import { TierBadge } from './TierBadge';
import { COPY } from '@/lib/i18n/copy';

export function ProgressOverview({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();
  const summary = useMemo(
    () => (progress ? summariseProgress(progress, topics) : null),
    [progress, topics],
  );

  if (!progress || !summary) return <Card className="h-64 animate-pulse" aria-hidden="true" />;

  return (
    <div className="flex flex-col gap-6">
      <Card className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Answers" value={String(summary.answered)} />
        <Stat label="Correct" value={`${Math.round(summary.accuracy * 100)}%`} />
        <Stat label="Topics started" value={`${summary.started}/${topics.length}`} />
      </Card>

      <section aria-labelledby="tiers-heading">
        <h2 id="tiers-heading" className="mb-3 font-display text-xl font-bold text-ink">
          <Ui {...COPY.progress.medals} />
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIERS.filter((t) => t !== 'new').map((tier) => (
            <li key={tier}>
              <Card className="flex flex-col items-center gap-1 p-3">
                <TierBadge tier={tier} />
                <span className="text-2xl font-bold text-ink tabular-nums">
                  {summary.tierCounts[tier]}
                </span>
                <span className="sr-only">
                  <Ui {...TIER_LABELS[tier]} />
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="mb-3 font-display text-xl font-bold text-ink">
          Topics
        </h2>
        <ul className="flex flex-col gap-3">
          {topics.map((topic) => {
            const topicProgress = progress.topics[topic.id];
            const mastery = masteryFor(topicProgress, topic.modes);
            return (
              <li key={topic.id}>
                <Link href={`/topics/${topic.id}`} className="block rounded-3xl hover:bg-sunken">
                  <Card className="bg-transparent">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-bold text-ink">
                        {topic.title}{' '}
                        <span className="text-xs font-semibold text-muted">{topic.level}</span>
                      </p>
                      <TierBadge tier={mastery.tier} />
                    </div>
                    {topicProgress && (
                      <>
                        <ProgressBar
                          className="mt-3"
                          value={mastery.recentAccuracy}
                          label={`${topic.title} recent accuracy`}
                          fillClassName="bg-correct"
                        />
                        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                          <span>{topicProgress.answered} answered</span>
                          {topic.modes.map((mode) => {
                            const best = topicProgress.modes[mode];
                            return best ? (
                              <span key={mode}>
                                {MODE_INFO[mode].name} best:{' '}
                                <strong className="text-ink">{best.bestScore}</strong>
                              </span>
                            ) : null;
                          })}
                        </p>
                      </>
                    )}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-ink tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
