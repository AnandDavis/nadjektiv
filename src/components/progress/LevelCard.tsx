'use client';

import { Card, ProgressBar } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { levelForXp } from '@/lib/progress/level';

export function LevelCard() {
  const progress = useProgress();
  if (!progress) return <Card className="h-24 animate-pulse" aria-hidden="true" />;

  const info = levelForXp(progress.xp);
  return (
    <Card className="flex items-center gap-4">
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand text-on-brand">
        <span className="text-xs font-semibold">Level</span>
        <span className="text-2xl leading-none font-bold">{info.level}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-display text-lg font-bold text-ink">{info.title}</p>
          <p className="text-sm text-muted tabular-nums">
            {progress.xp - info.floorXp} / {info.nextXp - info.floorXp} XP
          </p>
        </div>
        <ProgressBar
          className="mt-2"
          value={info.fraction}
          label={`Progress to level ${info.level + 1}`}
        />
      </div>
    </Card>
  );
}
