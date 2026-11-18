import Link from 'next/link';

import { BoltIcon, CrossIcon, ProgressBar, Ui } from '@/components/ui';
import { comboMultiplier, type ComboChange } from '@/lib/game/scoring';
import { COPY, comboLine } from '@/lib/i18n/copy';

interface GameHeaderProps {
  exitHref: string;
  title: React.ReactNode;
  score: number;
  combo: number;
  /** Untimed rounds show question progress; timed rounds pass their own timer. */
  progress?: { current: number; total: number };
  timer?: React.ReactNode;
  /** What the last answer did to the combo, for a moment's call-out. */
  comboChange?: ComboChange;
}

export function GameHeader({
  exitHref,
  title,
  score,
  combo,
  progress,
  timer,
  comboChange,
}: GameHeaderProps) {
  const multiplier = comboMultiplier(combo);
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Link
          href={exitHref}
          aria-label="Quit round"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center text-xl text-ink hover:bg-ink hover:text-canvas"
        >
          <CrossIcon />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-sm font-extrabold tracking-widest text-ink uppercase">
          {title}
        </h1>
        <div className="flex items-stretch gap-1" aria-live="polite">
          {comboChange?.kind === 'lost' && (
            <span className="flex items-center bg-red px-2 text-xs font-black text-on-red uppercase motion-safe:animate-shake">
              <Ui {...COPY.game.comboLost} />
            </span>
          )}
          {multiplier > 1 && (
            // Keyed by the multiplier so it pops again each time it rises.
            <span
              key={multiplier}
              className="flex items-center gap-0.5 bg-yellow px-2 text-sm font-black text-on-yellow motion-safe:animate-pop"
            >
              <BoltIcon />×{multiplier}
              {comboChange?.kind === 'up' && (
                <span className="sr-only">
                  <Ui {...comboLine(multiplier)} />
                </span>
              )}
            </span>
          )}
          <span
            className="bg-ink px-2.5 py-1 text-lg font-black text-canvas tabular-nums"
            aria-label={`Score ${score}`}
          >
            {score}
          </span>
        </div>
      </div>
      {timer}
      {progress && (
        <div className="flex items-end gap-3">
          <span className="text-4xl leading-none font-black tracking-tighter text-ink tabular-nums">
            {String(progress.current).padStart(2, '0')}
            <span className="text-base font-extrabold tracking-normal text-muted">
              /{progress.total}
            </span>
          </span>
          <ProgressBar
            className="mb-1.5"
            value={progress.current / progress.total}
            label={`Question ${progress.current} of ${progress.total}`}
            fillClassName="bg-ink"
          />
        </div>
      )}
    </header>
  );
}
