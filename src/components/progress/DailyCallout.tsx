'use client';

import Link from 'next/link';

import { CheckIcon, Shape, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { DAILY_LENGTH, dailyKey, isDailyDone } from '@/lib/game/daily';
import { COPY, dailyHint } from '@/lib/i18n/copy';

interface DailyCalloutProps {
  /**
   * Which state this slot shows: today's mix still to play (a full callout under the
   * home heading) or already done (one compact line above the search).
   */
  show: 'pending' | 'done';
}

/** Today's mix on the home page. No streak, nothing to lose. */
export function DailyCallout({ show }: DailyCalloutProps) {
  const progress = useProgress();
  // Progress (and so today's date) only exists in the browser.
  if (!progress) return null;
  const isDone = isDailyDone(progress, dailyKey(new Date()));
  if (isDone !== (show === 'done')) return null;

  if (isDone) {
    return (
      <Link
        href="/play/daily"
        className="flex min-h-11 items-center gap-2 border-2 border-line px-3 text-sm text-ink transition-colors hover:bg-ink hover:text-canvas"
      >
        <CheckIcon className="shrink-0 text-correct" />
        <span className="font-extrabold uppercase">
          <Ui {...COPY.daily.title} />
          {' · '}
          <Ui {...COPY.daily.done} />
        </span>
      </Link>
    );
  }

  const hasProgress = Object.keys(progress.topics).length > 0;
  return (
    <Link
      href="/play/daily"
      className="flex min-h-16 items-center gap-3 border-2 border-ink bg-blue p-4 text-on-blue transition-colors hover:bg-ink hover:text-canvas"
    >
      <span className="flex gap-0.5 text-sm" aria-hidden="true">
        <Shape kind="square" color="yellow" />
        <Shape kind="circle" color="yellow" />
        <Shape kind="triangle" color="yellow" />
      </span>
      <span className="flex-1">
        <span className="block text-lg font-black uppercase">
          <Ui {...COPY.daily.title} />
        </span>
        <span className="block text-sm">
          <Ui {...dailyHint(DAILY_LENGTH, hasProgress)} />
        </span>
      </span>
    </Link>
  );
}
