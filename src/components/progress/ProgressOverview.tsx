'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { Card, ProgressBar, SectionHeading, Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import { useProgress } from '@/hooks/useProgress';
import { MODE_INFO } from '@/lib/game/modes';
import { TIERS, TIER_LABELS, masteryFor } from '@/lib/progress/mastery';
import { summariseProgress } from '@/lib/progress/summary';

import { TierBadge } from './TierBadge';
import { TopicMap } from './TopicMap';
import { COPY } from '@/lib/i18n/copy';
import { topicHref } from '@/lib/routes';

export function ProgressOverview({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();
  const summary = useMemo(
    () => (progress ? summariseProgress(progress, topics) : null),
    [progress, topics],
  );

  if (!progress || !summary) return <Card className="h-64 animate-pulse" aria-hidden="true" />;

  return (
    // One gap between every block, matching the page's own (see the progress page).
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 border-2 border-ink bg-surface">
        <Stat label={<Ui {...COPY.common.answers} />} value={String(summary.answered)} />
        <Stat
          label={<Ui {...COPY.common.correct} />}
          value={`${Math.round(summary.accuracy * 100)}%`}
        />
        <Stat
          label={<Ui {...COPY.common.topics} />}
          value={`${summary.started}/${topics.length}`}
        />
      </div>

      <section aria-labelledby="tiers-heading">
        {/* The badges speak for themselves; the heading stays for screen readers. */}
        <h2 id="tiers-heading" className="sr-only">
          <Ui {...COPY.progress.medals} />
        </h2>
        <ul className="grid grid-cols-2 gap-0.5 border-2 border-ink bg-ink sm:grid-cols-4">
          {TIERS.filter((t) => t !== 'new').map((tier) => (
            <li key={tier} className="flex flex-col items-start gap-2 bg-surface p-3">
              <TierBadge tier={tier} />
              <span className="text-4xl leading-none font-black text-ink tabular-nums">
                {summary.tierCounts[tier]}
              </span>
              <span className="sr-only">
                <Ui {...TIER_LABELS[tier]} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <TopicMap topics={topics} progress={progress} />

      <section aria-labelledby="topics-heading">
        <SectionHeading id="topics-heading">
          <Ui {...COPY.common.topics} />
        </SectionHeading>
        <ul>
          {topics.map((topic, index) => {
            const topicProgress = progress.topics[topic.id];
            const mastery = masteryFor(topicProgress, topic.modes);
            return (
              <li key={topic.id} className="border-b-2 border-ink">
                <Link
                  href={topicHref(topic.id, 'progress')}
                  className="flex gap-3 py-3 transition-colors hover:bg-sunken"
                >
                  <span className="w-7 shrink-0 text-right font-black text-muted tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-ink">
                        <Ui de={topic.titleDe} en={topic.title} />{' '}
                        <span className="text-xs font-extrabold text-muted">{topic.level}</span>
                      </span>
                      <TierBadge tier={mastery.tier} />
                    </span>
                    {topicProgress && (
                      <>
                        <ProgressBar
                          className="mt-2"
                          value={mastery.recentAccuracy}
                          label={`${topic.title} recent accuracy`}
                          fillClassName="bg-correct"
                        />
                        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted uppercase">
                          <span>
                            {topicProgress.answered} <Ui {...COPY.common.answered} />
                          </span>
                          {topic.modes.map((mode) => {
                            const best = topicProgress.modes[mode];
                            return best ? (
                              <span key={mode}>
                                {MODE_INFO[mode].name} <Ui {...COPY.common.best} />{' '}
                                <strong className="text-ink">{best.bestScore}</strong>
                              </span>
                            ) : null;
                          })}
                        </span>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="border-l-2 border-ink p-3 first:border-l-0">
      <p className="text-3xl leading-none font-black text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-extrabold tracking-wider text-muted uppercase">{label}</p>
    </div>
  );
}
