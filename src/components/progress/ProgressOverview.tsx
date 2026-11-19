'use client';

import { useMemo } from 'react';

import { Card, Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';
import { TIERS, TIER_LABELS } from '@/lib/progress/mastery';
import { summariseProgress } from '@/lib/progress/summary';

import { HistoryCharts } from './HistoryCharts';
import { ProgressTopicList } from './ProgressTopicList';
import { TierBadge } from './TierBadge';
import { TopicMap } from './TopicMap';

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
        <Stat label={<Ui {...COPY.revise.title} />} value={String(summary.toRevise)} />
        <Stat
          label={<Ui {...COPY.common.correct} />}
          value={`${Math.round(summary.accuracy * 100)}%`}
        />
        <Stat
          label={<Ui {...COPY.common.topics} />}
          value={`${summary.started}/${topics.length}`}
        />
      </div>

      <HistoryCharts progress={progress} />

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

      <ProgressTopicList topics={topics} progress={progress} />
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
