import Link from 'next/link';

import { TierBadge } from '@/components/progress/TierBadge';
import type { TopicSummary } from '@/content/summaries';
import type { MasteryInfo } from '@/lib/progress/mastery';

interface TopicCardProps {
  topic: TopicSummary;
  /** Undefined while progress is loading. */
  mastery?: MasteryInfo;
}

export function TopicCard({ topic, mastery }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="flex min-h-20 items-center gap-3 rounded-3xl border border-line bg-surface p-4 shadow-card transition hover:bg-sunken motion-safe:active:translate-y-px"
    >
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight font-bold text-ink">{topic.title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted">{topic.tagline}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {mastery ? (
          <TierBadge tier={mastery.tier} />
        ) : (
          <span className="h-6 w-20 animate-pulse rounded-full bg-sunken" aria-hidden="true" />
        )}
        {mastery && mastery.tier !== 'new' && (
          <span className="text-xs text-muted tabular-nums">
            {Math.round(mastery.recentAccuracy * 100)}% recently
          </span>
        )}
      </div>
    </Link>
  );
}
