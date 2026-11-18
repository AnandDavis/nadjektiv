'use client';

import Link from 'next/link';

import { TierBadge } from '@/components/progress/TierBadge';
import { ArrowLeftIcon, Badge, CheckIcon, Card } from '@/components/ui';
import type { GameMode, Level } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { TIER_LABELS, masteryFor } from '@/lib/progress/mastery';
import { cn } from '@/lib/utils/cn';

interface TopicHeaderProps {
  topicId: string;
  title: string;
  level: Level;
  tagline: string;
  modes: GameMode[];
}

export function TopicHeader({ topicId, title, level, tagline, modes }: TopicHeaderProps) {
  const progress = useProgress();
  const mastery = progress ? masteryFor(progress.topics[topicId], modes) : null;

  return (
    <header className="flex flex-col gap-4">
      <Link
        href="/"
        className="-ml-2 flex min-h-11 w-fit items-center gap-1 rounded-xl px-2 font-semibold text-muted hover:bg-sunken"
      >
        <ArrowLeftIcon /> All topics
      </Link>
      <div>
        <div className="flex items-center gap-2">
          <Badge>{level}</Badge>
          {mastery && <TierBadge tier={mastery.tier} />}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-muted">{tagline}</p>
      </div>
      {mastery?.next && (
        <Card className="p-3">
          <p className="text-sm font-bold text-ink">Next: {TIER_LABELS[mastery.next.tier]}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {mastery.next.requirements.map((req) => (
              <li
                key={req.label}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  req.isMet ? 'text-correct' : 'text-muted',
                )}
              >
                <span aria-hidden="true" className="mt-0.5">
                  {req.isMet ? <CheckIcon /> : '○'}
                </span>
                <span>
                  {req.label}
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
