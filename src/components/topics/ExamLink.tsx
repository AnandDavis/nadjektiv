'use client';

import Link from 'next/link';

import { Ui } from '@/components/ui';
import type { Level } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { EXAM_LENGTH, gradeFor } from '@/lib/exam/exam';
import { COPY, examHint, examTitle } from '@/lib/i18n/copy';

/** The level test, at the end of the level's topics, with the best grade so far. */
export function ExamLink({ level }: { level: Level }) {
  const progress = useProgress();
  const best = progress?.exams?.[level]?.bestPercent;
  return (
    <Link
      href={`/play/exam/${level.toLowerCase()}`}
      className="mt-10 flex min-h-16 items-center gap-4 border-4 border-ink p-4 text-ink transition-colors hover:bg-ink hover:text-canvas"
    >
      <span className="flex-1">
        <span className="block text-xl font-black uppercase">
          <Ui {...examTitle(level)} />
        </span>
        <span className="block text-sm">
          <Ui {...examHint(level, EXAM_LENGTH)} />
        </span>
        {best !== undefined && (
          <span className="mt-1 block text-xs font-extrabold tracking-widest uppercase">
            <Ui {...COPY.exam.best} />: <Ui {...COPY.exam[gradeFor(best)]} /> ·{' '}
            <span className="tabular-nums">{best}%</span>
          </span>
        )}
      </span>
      <span aria-hidden="true" className="text-2xl font-black">
        →
      </span>
    </Link>
  );
}
