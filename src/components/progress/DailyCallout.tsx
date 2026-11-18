'use client';

import Link from 'next/link';

import { CheckIcon, Shape, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { DAILY_LENGTH, dailyKey, isDailyDone } from '@/lib/game/daily';
import { COPY, dailyHint } from '@/lib/i18n/copy';
import { cn } from '@/lib/utils/cn';

/** Today's mix on the home page, marked once it's done. No streak, nothing to lose. */
export function DailyCallout() {
  const progress = useProgress();
  // Progress (and so today's date) only exists in the browser.
  if (!progress) return null;
  const isDone = isDailyDone(progress, dailyKey(new Date()));
  const hasProgress = Object.keys(progress.topics).length > 0;

  return (
    <Link
      href="/play/daily"
      className={cn(
        'flex min-h-16 items-center gap-3 border-2 border-ink p-4 transition-colors hover:bg-ink hover:text-canvas',
        isDone ? 'bg-surface text-ink' : 'bg-blue text-on-blue',
      )}
    >
      {isDone ? (
        <CheckIcon className="text-2xl" />
      ) : (
        <span className="flex gap-0.5 text-sm" aria-hidden="true">
          <Shape kind="square" color="yellow" />
          <Shape kind="circle" color="yellow" />
          <Shape kind="triangle" color="yellow" />
        </span>
      )}
      <span className="flex-1">
        <span className="block text-lg font-black uppercase">
          <Ui {...COPY.daily.title} />
          {isDone && (
            <>
              {' · '}
              <Ui {...COPY.daily.done} />
            </>
          )}
        </span>
        <span className="block text-sm">
          <Ui {...(isDone ? COPY.daily.doneHint : dailyHint(DAILY_LENGTH, hasProgress))} />
        </span>
      </span>
    </Link>
  );
}
