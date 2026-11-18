import { TierBadge } from '@/components/progress/TierBadge';
import { Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import type { MasteryInfo } from '@/lib/progress/mastery';

import { TopicLink } from './TopicLink';

interface TopicCardProps {
  topic: TopicSummary;
  /** Position in the learning order, shown as 01, 02 … */
  index: number;
  /** Undefined while progress is loading. */
  mastery?: MasteryInfo;
  /** Called as the topic opens, e.g. to clear the search that found it. */
  onOpen?: () => void;
}

/** One row of the topic index. */
export function TopicCard({ topic, index, mastery, onOpen }: TopicCardProps) {
  return (
    <TopicLink
      topicId={topic.id}
      onClick={onOpen}
      className="group flex min-h-20 items-start gap-3 py-3 transition-colors hover:bg-yellow hover:text-on-yellow"
    >
      <span className="w-9 shrink-0 pt-0.5 text-right text-lg font-black text-muted tabular-nums group-hover:text-on-yellow">
        {String(index).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg leading-tight font-extrabold text-ink group-hover:text-on-yellow">
          <Ui de={topic.titleDe} en={topic.title} />
        </span>
        <span className="mt-0.5 line-clamp-2 block text-sm text-muted group-hover:text-on-yellow">
          {topic.tagline}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 pt-0.5 pr-1">
        {mastery ? (
          <TierBadge tier={mastery.tier} />
        ) : (
          <span className="h-6 w-16 animate-pulse bg-sunken" aria-hidden="true" />
        )}
        {mastery && mastery.tier !== 'new' && (
          <span className="text-xs font-bold text-muted tabular-nums group-hover:text-on-yellow">
            {Math.round(mastery.recentAccuracy * 100)}%
          </span>
        )}
      </span>
    </TopicLink>
  );
}
