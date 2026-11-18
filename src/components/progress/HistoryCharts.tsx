'use client';

import { useMemo, type ReactNode } from 'react';

import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import { accuracyPerWeek, answersPerDay } from '@/lib/progress/history';
import type { Progress } from '@/lib/progress/types';
import { dailyKey } from '@/lib/utils/day';

const LABEL = 'text-xs font-extrabold tracking-widest text-muted uppercase';

/** "18.11." from "2026-11-18". */
function shortDate(day: string): string {
  const [, m, d] = day.split('-').map(Number);
  return `${d}.${m}.`;
}

interface Bar {
  key: string;
  /** 0–1 of the chart's height. */
  share: number;
  /** Shown on hover. */
  title: string;
}

/** A single-series bar chart; the table beside it carries the numbers for screen readers. */
function Bars({ bars, top }: { bars: Bar[]; top?: ReactNode[] }) {
  return (
    <div aria-hidden="true">
      {top && (
        <div className="flex gap-0.5">
          {top.map((label, i) => (
            <span
              key={bars[i].key}
              className="flex-1 text-center text-xs font-bold text-muted tabular-nums"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="flex h-28 items-end gap-0.5 border-b-2 border-ink">
        {bars.map((bar) => (
          <div
            key={bar.key}
            title={bar.title}
            className="flex-1 bg-blue"
            style={{ height: `${Math.round(bar.share * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Answers per day and the share right per week, from the learner's daily history. */
export function HistoryCharts({ progress }: { progress: Progress }) {
  const { days, weeks } = useMemo(() => {
    const today = dailyKey(new Date());
    return {
      days: answersPerDay(progress.history, today),
      weeks: accuracyPerWeek(progress.history, today),
    };
  }, [progress.history]);

  if (!days.some((d) => d.answered > 0) && !weeks.some((w) => w.answered > 0)) {
    return (
      <p className="border-2 border-ink p-4 text-sm text-muted">
        <Ui {...COPY.progress.noHistory} />
      </p>
    );
  }

  const most = Math.max(1, ...days.map((d) => d.answered));
  const pct = (accuracy?: number) =>
    accuracy === undefined ? '–' : `${Math.round(accuracy * 100)}%`;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section aria-labelledby="per-day">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 id="per-day" className={LABEL}>
            <Ui {...COPY.progress.perDay} />
          </h2>
          <span className="text-xs font-bold text-muted tabular-nums">max {most}</span>
        </div>
        <Bars
          bars={days.map((d) => ({
            key: d.day,
            share: d.answered / most,
            title: `${shortDate(d.day)}: ${d.answered}`,
          }))}
        />
        <p aria-hidden="true" className="mt-1 flex justify-between text-xs font-bold text-muted">
          <span>{shortDate(days[0].day)}</span>
          <Ui {...COPY.progress.today} />
        </p>
        <table className="sr-only">
          <thead>
            <tr>
              <th>
                <Ui {...COPY.progress.day} />
              </th>
              <th>
                <Ui {...COPY.progress.answers} />
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.day}>
                <td>{shortDate(d.day)}</td>
                <td>{d.answered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="per-week">
        <h2 id="per-week" className={`mb-2 ${LABEL}`}>
          <Ui {...COPY.progress.perWeek} />
        </h2>
        <Bars
          bars={weeks.map((w) => ({
            key: w.end,
            share: w.accuracy ?? 0,
            title: `${shortDate(w.end)}: ${pct(w.accuracy)}`,
          }))}
          top={weeks.map((w) => pct(w.accuracy))}
        />
        <p aria-hidden="true" className="mt-1 flex justify-between text-xs font-bold text-muted">
          <span>{shortDate(weeks[0].end)}</span>
          <Ui {...COPY.progress.thisWeek} />
        </p>
        <table className="sr-only">
          <thead>
            <tr>
              <th>
                <Ui {...COPY.progress.week} />
              </th>
              <th>
                <Ui {...COPY.progress.correct} />
              </th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.end}>
                <td>{shortDate(w.end)}</td>
                <td>{pct(w.accuracy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
