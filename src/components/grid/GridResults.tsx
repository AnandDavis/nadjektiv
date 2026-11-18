'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Celebrations, ResultStat, ReviseNote } from '@/components/game/RoundOutcome';
import { Button, ButtonLink, Ui } from '@/components/ui';
import type { GridPuzzle } from '@/content/types';
import { resultHeadline } from '@/lib/game/result-headline';
import type { AnswerRecord } from '@/lib/game/scoring';
import { blankCells, isGridComplete, type GridRoundState } from '@/lib/grid/grid-round';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import type { SessionOutcome } from '@/lib/progress/apply-session';
import { formatDuration } from '@/lib/utils/format-duration';

import { GridBoard } from './GridBoard';

interface GridResultsProps {
  grid: GridPuzzle;
  state: GridRoundState;
  outcome: SessionOutcome | null;
  exitHref: string;
  exitLabel: ReactNode;
  topicTitles: Readonly<Record<string, Bilingual>>;
  onPlayAgain: () => void;
  onOtherTable: () => void;
}

export function GridResults({
  grid,
  state,
  outcome,
  exitHref,
  exitLabel,
  topicTitles,
  onPlayAgain,
  onOtherTable,
}: GridResultsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Start the results at the top and announce the headline, as for question rounds.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const total = blankCells(grid).length;
  const answers: AnswerRecord[] = blankCells(grid).map((key) => ({
    questionId: key,
    topicId: '',
    isCorrect: state.solved.includes(key),
    given: '',
  }));
  const complete = isGridComplete(state, grid);
  const time =
    complete && state.finishedAt !== undefined
      ? formatDuration(state.finishedAt - state.startedAt)
      : '–';

  return (
    <div className="flex flex-col gap-5 motion-safe:animate-rise">
      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-display leading-none font-black text-ink uppercase focus:outline-none"
        >
          <Ui {...resultHeadline(answers)} />
        </h2>
        <p className="mt-2 text-sm font-extrabold tracking-widest text-muted uppercase">
          <Ui de={grid.titleDe} en={grid.title} />
        </p>
      </div>

      <div className="grid grid-cols-3 border-2 border-ink">
        <ResultStat label={<Ui {...COPY.grid.cells} />} value={`${state.solved.length}/${total}`} />
        <ResultStat label={<Ui {...COPY.grid.time} />} value={time} />
        <ResultStat
          label="XP"
          value={`+${outcome?.xpGained ?? 0}`}
          className="bg-yellow text-on-yellow"
        />
      </div>

      {outcome && <Celebrations outcome={outcome} topicTitles={topicTitles} />}
      {outcome && <ReviseNote added={outcome.addedToRevise} cleared={outcome.clearedFromRevise} />}

      <section aria-labelledby="answer-key-heading" className="flex flex-col gap-3">
        <h3
          id="answer-key-heading"
          className="border-b-4 border-ink pb-1 text-lg font-black text-ink uppercase"
        >
          <Ui {...COPY.grid.answerKey} />
        </h3>
        <GridBoard grid={grid} state={state} />
        <p className="text-sm text-ink">
          <span className="font-extrabold">
            <Ui {...COPY.game.why} />{' '}
          </span>
          {grid.explanation}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="lg" onClick={onOtherTable}>
          <Ui {...COPY.grid.otherTable} />
        </Button>
        <Button size="lg" onClick={onPlayAgain}>
          <Ui {...COPY.game.playAgain} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href={exitHref} variant="ghost">
          {exitLabel}
        </ButtonLink>
        <ButtonLink href="/" variant="ghost">
          <Ui {...COPY.common.home} />
        </ButtonLink>
      </div>
    </div>
  );
}
