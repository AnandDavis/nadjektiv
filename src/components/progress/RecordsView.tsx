'use client';

import { useMemo } from 'react';

import { Card, SectionHeading, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { MODE_INFO } from '@/lib/game/modes';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { personalRecords, type RecordMode } from '@/lib/progress/records';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format-duration';

export interface GridLabel {
  id: string;
  topicId: string;
  title: Bilingual;
  /** Cells to fill, to show "12/16". */
  cells: number;
}

interface RecordsViewProps {
  topicIds: string[];
  topicTitles: Readonly<Record<string, Bilingual>>;
  grids: GridLabel[];
}

const LABEL = 'text-xs font-extrabold tracking-widest text-muted uppercase';

function ModeName({ mode }: { mode: RecordMode }) {
  if (mode === 'sortUntimed') {
    return (
      <>
        {MODE_INFO.sort.name} <Ui {...COPY.records.untimed} />
      </>
    );
  }
  return <>{MODE_INFO[mode].name}</>;
}

function Headline({
  label,
  value,
  detail,
}: {
  label: Bilingual;
  value: string;
  detail?: Bilingual;
}) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-ink p-3 first:border-l-0">
      <span className={LABEL}>
        <Ui {...label} />
      </span>
      <span className="text-3xl leading-none font-black text-ink tabular-nums">{value}</span>
      {detail && (
        <span className="text-xs text-muted">
          <Ui {...detail} />
        </span>
      )}
    </div>
  );
}

/**
 * Labels over a list's number columns, right-aligned to the same widths. Hidden from
 * screen readers: each value carries its own label.
 */
function ColumnHeads({ labels, widths }: { labels: Bilingual[]; widths: string[] }) {
  return (
    <div aria-hidden="true" className={cn('flex gap-3 pb-1', LABEL)}>
      <span className="flex-1" />
      {labels.map((label, i) => (
        <span key={i} className={cn('text-right', widths[i])}>
          <Ui {...label} />
        </span>
      ))}
    </div>
  );
}

/** Every personal best in one place, read from the bests progress already keeps. */
export function RecordsView({ topicIds, topicTitles, grids }: RecordsViewProps) {
  const progress = useProgress();
  const records = useMemo(
    () =>
      progress
        ? personalRecords(
            progress,
            topicIds,
            grids.map((g) => g.id),
          )
        : null,
    [progress, topicIds, grids],
  );
  if (!records) return <Card className="h-40 animate-pulse" aria-hidden="true" />;
  if (records.topics.length === 0 && records.grids.length === 0) {
    return (
      <Card>
        <p className="text-ink">
          <Ui {...COPY.records.none} />
        </p>
      </Card>
    );
  }
  const gridById = new Map(grids.map((g) => [g.id, g]));
  const title = (id: string): Bilingual => topicTitles[id] ?? { de: id, en: id };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 border-2 border-ink bg-surface">
        <Headline
          label={COPY.records.bestBlitz}
          value={records.bestBlitz ? String(records.bestBlitz.score) : '–'}
          detail={records.bestBlitz && title(records.bestBlitz.topicId)}
        />
        <Headline
          label={COPY.records.longestCombo}
          value={records.longestCombo ? `×${records.longestCombo.combo}` : '–'}
          detail={records.longestCombo && title(records.longestCombo.topicId)}
        />
        <Headline
          label={COPY.records.fastestTable}
          value={records.fastestGrid ? formatDuration(records.fastestGrid.timeMs) : '–'}
          detail={records.fastestGrid && gridById.get(records.fastestGrid.gridId)?.title}
        />
      </div>

      {records.grids.length > 0 && (
        <section aria-labelledby="records-tables">
          <SectionHeading id="records-tables">
            <Ui {...COPY.records.tables} />
          </SectionHeading>
          <ColumnHeads labels={[COPY.records.cells, COPY.records.time]} widths={['', 'w-14']} />
          <ul>
            {records.grids.map(({ gridId, best }) => {
              const grid = gridById.get(gridId);
              return (
                <li key={gridId} className="flex items-baseline gap-3 border-b-2 border-line py-3">
                  <span className="min-w-0 flex-1 font-extrabold text-ink">
                    {grid ? <Ui {...grid.title} /> : gridId}
                  </span>
                  <span className="text-sm text-muted tabular-nums">
                    <span className="sr-only">
                      <Ui {...COPY.records.cells} />:{' '}
                    </span>
                    {best.bestCells}/{grid?.cells ?? '?'}
                  </span>
                  <span className="w-14 text-right font-black text-ink tabular-nums">
                    <span className="sr-only">
                      <Ui {...COPY.records.time} />:{' '}
                    </span>
                    {best.bestTimeMs !== undefined ? formatDuration(best.bestTimeMs) : '–'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {records.topics.length > 0 && (
        <section aria-labelledby="records-topics">
          <SectionHeading id="records-topics">
            <Ui {...COPY.common.topics} />
          </SectionHeading>
          <ColumnHeads
            labels={[COPY.records.best, COPY.common.correct, COPY.records.run]}
            widths={['w-20', 'w-12', 'w-10']}
          />
          <ul>
            {records.topics.map(({ topicId, modes }) => (
              <li key={topicId} className="border-b-2 border-line py-3">
                <p className="font-extrabold text-ink">
                  <Ui {...title(topicId)} />
                </p>
                <dl className="mt-1 flex flex-col gap-1 text-sm">
                  {modes.map(({ mode, best }) => (
                    <div key={mode} className="flex items-baseline gap-3">
                      <dt className="min-w-0 flex-1 text-muted">
                        <ModeName mode={mode} />
                      </dt>
                      <dd className="w-20 text-right font-black text-ink tabular-nums">
                        <span className="sr-only">
                          <Ui {...COPY.records.best} />:{' '}
                        </span>
                        {best.bestScore} <Ui {...COPY.common.pointsShort} />
                      </dd>
                      <dd className="w-12 text-right text-ink tabular-nums">
                        <span className="sr-only">
                          <Ui {...COPY.common.correct} />:{' '}
                        </span>
                        {Math.round(best.bestAccuracy * 100)}%
                      </dd>
                      <dd className="w-10 text-right text-ink tabular-nums">
                        <span className="sr-only">
                          <Ui {...COPY.records.run} />:{' '}
                        </span>
                        ×{best.bestCombo}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
