import Link from 'next/link';
import type { ReactNode } from 'react';

import { TierBadge } from '@/components/progress/TierBadge';
import { Card, CountUp, RepeatIcon, TrophyIcon, Ui } from '@/components/ui';
import type { BestKind, SessionOutcome } from '@/lib/progress/apply-session';
import { COPY, levelUpLine, type Bilingual } from '@/lib/i18n/copy';
import { levelForXp } from '@/lib/progress/level';
import { MOTION, staggerDelay } from '@/lib/ui/motion';
import { cn } from '@/lib/utils/cn';

/* Pieces shared by the end-of-round screens (question rounds and grid fill). */

const BEST_LABELS: Record<BestKind, Bilingual> = {
  score: COPY.game.newBestScore,
  accuracy: COPY.game.newBestAccuracy,
  combo: COPY.game.newBestCombo,
  time: COPY.game.newBestTime,
  cells: COPY.game.newBestCells,
};

/** Tells the learner where their mistakes went, and which ones they've now fixed. */
export function ReviseNote({ added, cleared }: { added: number; cleared: number }) {
  if (added === 0 && cleared === 0) return null;
  return (
    <Link
      href="/revise"
      className="flex min-h-11 items-center gap-3 border-2 border-ink bg-surface p-3 text-sm text-ink transition-colors hover:bg-ink hover:text-canvas"
    >
      <RepeatIcon className="shrink-0 text-xl" />
      <span className="flex-1">
        {added > 0 && (
          <span className="block">
            <strong>{added}</strong> <Ui {...COPY.revise.added} />
          </span>
        )}
        {cleared > 0 && (
          <span className="block">
            <strong>{cleared}</strong> <Ui {...COPY.revise.cleared} />
          </span>
        )}
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function Celebrations({
  outcome,
  topicTitles,
}: {
  outcome: SessionOutcome;
  topicTitles: Readonly<Record<string, Bilingual>>;
}) {
  const items: React.ReactNode[] = [];
  if (outcome.levelUp) {
    const { level, title } = levelForXp(outcome.progress.xp);
    items.push(
      <li key="level" className="motion-safe:animate-pop">
        <Ui {...levelUpLine(level)} />{' '}
        <strong>
          <Ui {...title} />
        </strong>
      </li>,
    );
  }
  for (const kind of outcome.newBests) {
    items.push(
      <li key={kind}>
        <Ui {...BEST_LABELS[kind]} />
      </li>,
    );
  }
  for (const up of outcome.tierUps) {
    items.push(
      <li key={up.topicId} className="flex flex-wrap items-center gap-2">
        {topicTitles[up.topicId] ? <Ui {...topicTitles[up.topicId]} /> : up.topicId}{' '}
        <Ui {...COPY.game.reached} /> <TierBadge tier={up.to} />
      </li>,
    );
  }
  if (items.length === 0) return null;
  return (
    <Card className="p-0" role="status">
      <p className="flex items-center gap-2 bg-blue px-3 py-1.5 text-sm font-extrabold tracking-widest text-on-blue uppercase">
        <TrophyIcon /> <Ui {...COPY.game.achievements} />
      </p>
      <ul className="flex flex-col gap-1 p-3 font-semibold text-ink">{items}</ul>
    </Card>
  );
}

export function ResultStat({
  label,
  value,
  count,
  className,
}: {
  label: ReactNode;
  /** The value as read out, and as shown without a count. */
  value: string;
  /** Count up to this number on arrival; `order` staggers the stats one after another. */
  count?: { to: number; format?: (n: number) => string; order: number };
  className?: string;
}) {
  return (
    <div className={cn('border-l-2 border-ink p-3 first:border-l-0', className)}>
      <p className="text-3xl leading-none font-black tabular-nums">
        {count ? (
          <>
            <CountUp
              to={count.to}
              format={count.format}
              delayMs={staggerDelay(count.order, MOTION.countStaggerMs)}
            />
            <span className="sr-only">{value}</span>
          </>
        ) : (
          value
        )}
      </p>
      <p className="mt-1 text-xs font-extrabold tracking-widest uppercase">{label}</p>
    </div>
  );
}
