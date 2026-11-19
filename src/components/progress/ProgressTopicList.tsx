import type { ReactNode } from 'react';

import { FoldSection, ProgressBar, Shape, Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import type { GameMode } from '@/content/types';
import { MODE_INFO } from '@/lib/game/modes';
import { COPY } from '@/lib/i18n/copy';
import { masteryFor } from '@/lib/progress/mastery';
import { fastestGridMs } from '@/lib/progress/records';
import type { Progress } from '@/lib/progress/types';
import { MODE_SHAPES } from '@/lib/ui/shapes';
import { formatDuration } from '@/lib/utils/format-duration';

import { TopicLink } from '../topics/TopicLink';
import { TierSquare } from './TierBadge';

interface ProgressTopicListProps {
  topics: TopicSummary[];
  progress: Progress;
}

/** A topic's best in one game, with its unit: points, or a time for Tabelle. */
function bestFor(progress: Progress, topicId: string, mode: GameMode): ReactNode {
  if (mode === 'grid') {
    const ms = fastestGridMs(progress, topicId);
    return ms === undefined ? null : formatDuration(ms);
  }
  const best = progress.topics[topicId]?.modes[mode];
  return best ? (
    <>
      {best.bestScore} <Ui {...COPY.common.pointsShort} />
    </>
  ) : null;
}

/** Every topic with its medal, recent accuracy and bests, folded away under the map. */
export function ProgressTopicList({ topics, progress }: ProgressTopicListProps) {
  return (
    <FoldSection id="topics" title={<Ui {...COPY.common.topics} />}>
      <ul>
        {topics.map((topic, index) => {
          const topicProgress = progress.topics[topic.id];
          const mastery = masteryFor(topicProgress, topic.modes);
          const bests = topic.modes.flatMap((mode) => {
            const value = bestFor(progress, topic.id, mode);
            return value === null ? [] : [{ mode, value }];
          });
          return (
            <li key={topic.id} className="border-b-2 border-ink">
              <TopicLink
                topicId={topic.id}
                origin="progress"
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
                    <TierSquare tier={mastery.tier} className="size-6 shrink-0" />
                  </span>
                  {topicProgress && (
                    <ProgressBar
                      className="mt-2"
                      value={mastery.recentAccuracy}
                      label={`${topic.title} recent accuracy`}
                      fillClassName="bg-correct"
                    />
                  )}
                  {bests.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                      {bests.map(({ mode, value }) => {
                        const shape = MODE_SHAPES[mode];
                        return (
                          <span
                            key={mode}
                            className="inline-flex items-center gap-1.5"
                            title={MODE_INFO[mode].name}
                          >
                            <Shape kind={shape.kind} color={shape.color} />
                            <span className="sr-only">
                              {MODE_INFO[mode].name} <Ui {...COPY.common.best} />
                            </span>
                            <strong className="text-ink tabular-nums">{value}</strong>
                          </span>
                        );
                      })}
                    </span>
                  )}
                </span>
              </TopicLink>
            </li>
          );
        })}
      </ul>
    </FoldSection>
  );
}
