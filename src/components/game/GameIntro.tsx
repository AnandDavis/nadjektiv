import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button, CrossIcon, Shape, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import type { ModeBest } from '@/lib/progress/types';
import type { ShapeSpec } from '@/lib/ui/shapes';

interface GameIntroProps {
  title: ReactNode;
  modeName: ReactNode;
  description: string;
  best?: ModeBest;
  isReady: boolean;
  /** The mode's shape mark, shown large above the title. */
  shape?: ShapeSpec;
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
  shape,
  exitHref,
  onStart,
}: GameIntroProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Link
        href={exitHref}
        aria-label="Close"
        className="-ml-2 flex size-11 items-center justify-center text-xl text-ink hover:bg-ink hover:text-canvas"
      >
        <CrossIcon />
      </Link>
      <div className="flex flex-1 flex-col justify-center gap-6 motion-safe:animate-rise">
        <div>
          {shape && <Shape kind={shape.kind} color={shape.color} className="text-6xl" />}
          <p className="mt-4 text-xs font-extrabold tracking-widest text-muted uppercase">
            {modeName}
          </p>
          <h1 className="mt-1 text-display leading-none font-black text-ink">{title}</h1>
          <p className="mt-4 text-ink">{description}</p>
        </div>
        {best && (
          <div className="grid grid-cols-3 border-2 border-ink">
            <Stat label={<Ui {...COPY.game.bestScore} />} value={String(best.bestScore)} />
            <Stat
              label={<Ui {...COPY.game.bestAccuracy} />}
              value={`${Math.round(best.bestAccuracy * 100)}%`}
            />
            <Stat label={<Ui {...COPY.game.bestCombo} />} value={String(best.bestCombo)} />
          </div>
        )}
        <Button
          size="lg"
          onClick={onStart}
          disabled={!isReady}
          className="w-full"
          data-shortcut="confirm"
        >
          <Ui {...COPY.game.start} />
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: ReactNode; value: string }) {
  return (
    <div className="border-l-2 border-ink p-2 first:border-l-0">
      <p className="text-2xl leading-none font-black text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-extrabold tracking-wider text-muted uppercase">{label}</p>
    </div>
  );
}
