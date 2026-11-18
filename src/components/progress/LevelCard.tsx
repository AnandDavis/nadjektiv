'use client';

import { ProgressBar, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { levelForXp } from '@/lib/progress/level';

/** Level as a big numeral block, with the XP bar to the next level. */
export function LevelCard() {
  const progress = useProgress();
  if (!progress) return <div className="h-24 animate-pulse bg-sunken" aria-hidden="true" />;

  const info = levelForXp(progress.xp);
  return (
    <div className="flex items-stretch border-2 border-ink">
      <div className="flex w-24 shrink-0 flex-col justify-between bg-blue px-3 py-2 text-on-blue">
        <span className="text-xs font-extrabold tracking-widest uppercase">Level</span>
        <span className="text-5xl leading-none font-black tracking-tighter tabular-nums">
          {String(info.level).padStart(2, '0')}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 bg-surface p-3">
        <p className="truncate text-xl font-black text-ink uppercase">
          <Ui {...info.title} />
        </p>
        <div>
          <ProgressBar
            value={info.fraction}
            label={`Progress to level ${info.level + 1}`}
            fillClassName="bg-ink"
          />
          <p className="mt-1 text-xs font-bold text-muted tabular-nums">
            {progress.xp - info.floorXp} / {info.nextXp - info.floorXp} XP
          </p>
        </div>
      </div>
    </div>
  );
}
