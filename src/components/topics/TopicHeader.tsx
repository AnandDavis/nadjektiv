'use client';

import { ViewTransition } from 'react';
import { TierBadge } from '@/components/progress/TierBadge';
import { Badge, CheckIcon, Card, Ui } from '@/components/ui';
import type { GameMode, Level } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { TIER_LABELS, masteryFor } from '@/lib/progress/mastery';
import { topicTitleTransition } from '@/lib/ui/transitions';
import { cn } from '@/lib/utils/cn';

import { TopicBackLink } from './TopicBackLink';
import { COPY } from '@/lib/i18n/copy';

interface TopicHeaderProps {
  topicId: string;
  title: string;
  titleDe: string;
  level: Level;
  tagline: string;
  modes: GameMode[];
}

export function TopicHeader({ topicId, title, titleDe, level, tagline, modes }: TopicHeaderProps) {
  const progress = useProgress();
  const mastery = progress ? masteryFor(progress.topics[topicId], modes) : null;

  return (
    <header className="flex flex-col gap-4">
      <TopicBackLink topicId={topicId} />
      <div>
        <div className="flex items-center gap-2">
          <Badge>{level}</Badge>
          {mastery && <TierBadge tier={mastery.tier} />}
        </div>
        {/* The title morphs here from its row in the topic list. */}
        <ViewTransition name={topicTitleTransition(topicId)} share="morph" default="none">
          <h1 className="mt-3 text-display leading-none font-black text-ink">
            <Ui de={titleDe} en={title} />
          </h1>
        </ViewTransition>
        <p className="mt-3 text-lg text-ink">{tagline}</p>
      </div>
      {mastery?.next && (
        <Card className="p-0">
          <p className="bg-ink px-3 py-1.5 text-xs font-extrabold tracking-widest text-canvas uppercase">
            <Ui {...COPY.topic.next} />: <Ui {...TIER_LABELS[mastery.next.tier]} />
          </p>
          <ul className="flex flex-col gap-1 p-3">
            {mastery.next.requirements.map((req) => (
              <li
                key={req.label.en}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  req.isMet ? 'text-correct' : 'text-muted',
                )}
              >
                <span aria-hidden="true" className="mt-0.5">
                  {req.isMet ? <CheckIcon /> : '○'}
                </span>
                <span>
                  <Ui {...req.label} />
                  {req.isMet && <span className="sr-only"> (done)</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </header>
  );
}
