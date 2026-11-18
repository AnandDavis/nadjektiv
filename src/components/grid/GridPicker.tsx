'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { CrossIcon, Shape, Ui } from '@/components/ui';
import type { GridPuzzle } from '@/content/types';
import { MODE_INFO } from '@/lib/game/modes';
import { blankCells } from '@/lib/grid/grid-round';
import { COPY } from '@/lib/i18n/copy';
import type { GridBest } from '@/lib/progress/types';
import { MODE_SHAPES } from '@/lib/ui/shapes';
import { formatClock, formatDuration } from '@/lib/utils/format-duration';

interface GridPickerProps {
  title: ReactNode;
  grids: GridPuzzle[];
  bests: Readonly<Record<string, GridBest>>;
  exitHref: string;
  onStart: (grid: GridPuzzle) => void;
}

/** The grid-fill intro: pick a table. Shows each table's size, time limit and best. */
export function GridPicker({ title, grids, bests, exitHref, onStart }: GridPickerProps) {
  const shape = MODE_SHAPES.grid;
  const info = MODE_INFO.grid;
  return (
    <div className="flex flex-col gap-6">
      <Link
        href={exitHref}
        aria-label="Close"
        className="-ml-2 flex size-11 items-center justify-center text-xl text-ink hover:bg-ink hover:text-canvas"
      >
        <CrossIcon />
      </Link>
      <div className="motion-safe:animate-rise">
        <Shape kind={shape.kind} color={shape.color} className="text-6xl" />
        <p className="mt-4 text-xs font-extrabold tracking-widest text-muted uppercase">
          {info.name} · {info.english}
        </p>
        <h1 className="mt-1 text-display leading-none font-black text-ink">{title}</h1>
        <p className="mt-4 text-ink">{info.description}</p>
      </div>

      <section aria-labelledby="tables-heading">
        <h2
          id="tables-heading"
          className="mb-3 border-b-4 border-ink pb-1 text-2xl font-black tracking-wide text-ink uppercase"
        >
          <Ui {...COPY.grid.chooseTable} />
        </h2>
        <ul>
          {grids.map((grid) => {
            const best = bests[grid.id];
            return (
              <li key={grid.id} className="border-b-2 border-ink">
                <button
                  type="button"
                  onClick={() => onStart(grid)}
                  className="group flex min-h-16 w-full items-center gap-3 py-3 pr-2 text-left transition-colors hover:bg-yellow"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-tight font-extrabold text-ink group-hover:text-on-yellow">
                      <Ui de={grid.titleDe} en={grid.title} />
                    </span>
                    <span className="mt-0.5 block text-xs font-bold tracking-wide text-muted uppercase group-hover:text-on-yellow">
                      {blankCells(grid).length} <Ui {...COPY.grid.cells} /> ·{' '}
                      {formatClock(grid.seconds)}
                    </span>
                  </span>
                  {best && (
                    <span className="shrink-0 border-2 border-ink bg-surface px-2 py-1 text-center">
                      <span className="block text-xs font-extrabold tracking-widest text-muted uppercase">
                        <Ui
                          {...(best.bestTimeMs !== undefined
                            ? COPY.grid.bestTime
                            : COPY.grid.mostCells)}
                        />
                      </span>
                      <span className="block text-lg leading-none font-black text-ink tabular-nums">
                        {best.bestTimeMs !== undefined
                          ? formatDuration(best.bestTimeMs)
                          : best.bestCells}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
