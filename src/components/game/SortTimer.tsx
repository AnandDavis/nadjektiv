'use client';

import { useEffect, useRef, useState } from 'react';

import { ClockIcon, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface SortTimerProps {
  seconds: number;
  onExpire: () => void;
}

/** Countdown for timed rounds. Calls onExpire once when it reaches zero. */
export function SortTimer({ seconds, onExpire }: SortTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const endsAt = Date.now() + seconds * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(id);
        onExpireRef.current();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [seconds]);

  const isLow = remaining <= 10;
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex w-14 items-center gap-1 font-bold tabular-nums',
          isLow ? 'text-wrong' : 'text-ink',
        )}
      >
        <ClockIcon />
        {remaining}s
      </span>
      <ProgressBar
        value={remaining / seconds}
        label="Time left"
        fillClassName={isLow ? 'bg-wrong' : 'bg-brand'}
      />
    </div>
  );
}
