import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button, Card, CrossIcon, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import type { ModeBest } from '@/lib/progress/types';

interface GameIntroProps {
  title: ReactNode;
  modeName: string;
  description: string;
  best?: ModeBest;
  isReady: boolean;
  /** Where the close button goes: the intro has no app header, so it needs its own way out. */
  exitHref: string;
  onStart: () => void;
}

export function GameIntro({
  title,
  modeName,
  description,
  best,
  isReady,
  exitHref,
  onStart,
}: GameIntroProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Link
        href={exitHref}
        aria-label="Close"
        className="-ml-2 flex size-11 items-center justify-center rounded-full text-xl text-muted hover:bg-sunken"
      >
        <CrossIcon />
      </Link>
      <div className="flex flex-1 flex-col justify-center gap-6 motion-safe:animate-rise">
        <div className="text-center">
          <p className="text-sm font-bold tracking-wide text-brand-strong uppercase">{modeName}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-3 text-muted">{description}</p>
        </div>
        {best && (
          <Card className="grid grid-cols-3 text-center">
            <Stat label="Best score" value={String(best.bestScore)} />
            <Stat label="Best accuracy" value={`${Math.round(best.bestAccuracy * 100)}%`} />
            <Stat label="Best combo" value={String(best.bestCombo)} />
          </Card>
        )}
        <Button size="lg" onClick={onStart} disabled={!isReady} className="w-full">
          <Ui {...COPY.game.start} />
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-ink tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
