import Link from 'next/link';

import { BoltIcon, CrossIcon, ProgressBar } from '@/components/ui';
import { comboMultiplier } from '@/lib/game/scoring';
import { cn } from '@/lib/utils/cn';

interface GameHeaderProps {
  exitHref: string;
  title: React.ReactNode;
  score: number;
  combo: number;
  /** Untimed rounds show question progress; timed rounds pass their own timer. */
  progress?: { current: number; total: number };
  timer?: React.ReactNode;
}

export function GameHeader({ exitHref, title, score, combo, progress, timer }: GameHeaderProps) {
  const multiplier = comboMultiplier(combo);
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Link
          href={exitHref}
          aria-label="Quit round"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl text-muted hover:bg-sunken"
        >
          <CrossIcon />
        </Link>
        <h1 className="min-w-0 flex-1 truncate font-display text-lg font-bold text-ink">{title}</h1>
        <div className="flex items-center gap-2" aria-live="polite">
          {multiplier > 1 && (
            <span className="flex items-center gap-0.5 rounded-full bg-brand px-2 py-0.5 text-sm font-bold text-on-brand motion-safe:animate-pop">
              <BoltIcon />×{multiplier}
            </span>
          )}
          <span className="font-bold text-ink tabular-nums" aria-label={`Score ${score}`}>
            {score}
          </span>
        </div>
      </div>
      {timer}
      {progress && (
        <div className="flex items-center gap-2">
          <ProgressBar
            value={progress.current / progress.total}
            label={`Question ${progress.current} of ${progress.total}`}
          />
          <span className={cn('w-12 text-right text-sm font-semibold text-muted tabular-nums')}>
            {progress.current}/{progress.total}
          </span>
        </div>
      )}
    </header>
  );
}
