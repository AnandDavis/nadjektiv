'use client';

import { useEffect, useRef, useState } from 'react';

import { ClockIcon, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface SortTimerProps {
  seconds: number;
  /** While paused (e.g. reading why an answer was wrong) the clock stands still. */
  isPaused: boolean;
  onExpire: () => void;
}

const TICK_MS = 200;

/** Countdown for timed rounds. Calls onExpire once when it reaches zero. */
export function SortTimer({ seconds, isPaused, onExpire }: SortTimerProps) {
  const [remainingMs, setRemainingMs] = useState(seconds * 1000);
  const remainingRef = useRef(seconds * 1000);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (isPaused || remainingRef.current <= 0) return;
    const endsAt = Date.now() + remainingRef.current;
    const id = window.setInterval(() => {
      const left = Math.max(0, endsAt - Date.now());
      remainingRef.current = left;
      setRemainingMs(left);
      if (left === 0) {
        window.clearInterval(id);
        onExpireRef.current();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  const remaining = Math.ceil(remainingMs / 1000);
  const isLow = remaining <= 10;
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex w-16 items-center gap-1 text-2xl font-black tabular-nums',
          isLow ? 'text-wrong' : 'text-ink',
        )}
      >
        <ClockIcon />
        {remaining}s
      </span>
      <ProgressBar
        value={remainingMs / (seconds * 1000)}
        label={isPaused ? 'Time left (paused)' : 'Time left'}
        fillClassName={isLow ? 'bg-red' : 'bg-ink'}
      />
    </div>
  );
}
