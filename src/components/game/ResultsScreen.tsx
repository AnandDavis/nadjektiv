'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Button, ButtonLink, PinnedActions, Ui } from '@/components/ui';
import type { Mistake } from '@/lib/game/game-reducer';
import { resultHeadline } from '@/lib/game/result-headline';
import { accuracy, type AnswerRecord } from '@/lib/game/scoring';
import type { SessionOutcome } from '@/lib/progress/apply-session';
import { COPY, correctCount, type Bilingual } from '@/lib/i18n/copy';

import { MistakeList } from './MistakeList';
import { Celebrations, ResultStat, ReviseNote } from './RoundOutcome';
import { GraduationPanel, type GraduationInfo } from './GraduationPanel';

interface ResultsScreenProps {
  score: number;
  answers: AnswerRecord[];
  mistakes: Mistake[];
  outcome: SessionOutcome | null;
  /** This round's longest run of right answers. */
  bestCombo: number;
  /** The all-time best run for this topic and game, once saved; none for mixed rounds. */
  recordCombo?: number;
  exitHref: string;
  exitLabel: ReactNode;
  topicTitles: Readonly<Record<string, Bilingual>>;
  /** About this round's topic, for a Gemeistert celebration. */
  graduation?: GraduationInfo;
  onPlayAgain: () => void;
  /** Shown under the stats, e.g. a level test's grade. */
  children?: ReactNode;
}

export function ResultsScreen({
  score,
  answers,
  mistakes,
  outcome,
  bestCombo,
  recordCombo,
  exitHref,
  exitLabel,
  topicTitles,
  graduation,
  onPlayAgain,
  children,
}: ResultsScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // A round can end mid-scroll (the clock, or a long mistake list below). Start the
  // results at the top, and announce the headline rather than a button further down.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const correct = answers.filter((a) => a.isCorrect).length;
  const percent = Math.round(accuracy(answers) * 100);
  const xp = outcome?.xpGained ?? 0;

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
          <Ui {...correctCount(correct, answers.length)} />
        </p>
      </div>

      <div className="grid grid-cols-3 border-2 border-ink">
        <ResultStat
          label={<Ui {...COPY.common.correct} />}
          value={`${percent}%`}
          count={{ to: percent, format: (n) => `${n}%`, order: 0 }}
        />
        <ResultStat
          label={<Ui {...COPY.common.points} />}
          value={String(score)}
          count={{ to: score, order: 1 }}
        />
        <ResultStat
          label="XP"
          value={`+${xp}`}
          count={{ to: xp, format: (n) => `+${n}`, order: 2 }}
          className="bg-yellow text-on-yellow"
        />
      </div>

      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink">
        <span>
          <span className="font-extrabold">
            <Ui {...COPY.records.longestCombo} />:
          </span>{' '}
          <span className="tabular-nums">×{bestCombo}</span>
        </span>
        {recordCombo !== undefined && (
          <span className="text-muted">
            <Ui {...COPY.common.best} />: <span className="tabular-nums">×{recordCombo}</span>
          </span>
        )}
      </p>

      {children}

      {outcome && <GraduationPanel outcome={outcome} topicTitles={topicTitles} info={graduation} />}

      {outcome && <Celebrations outcome={outcome} topicTitles={topicTitles} />}

      {outcome && <ReviseNote added={outcome.addedToRevise} cleared={outcome.clearedFromRevise} />}

      {mistakes.length > 0 && <MistakeList mistakes={mistakes} />}

      <PinnedActions atScreenEnd>
        <Button size="lg" onClick={onPlayAgain}>
          <Ui {...COPY.game.playAgain} />
        </Button>
        <div className={exitHref === '/' ? 'grid' : 'grid grid-cols-2 gap-3'}>
          <ButtonLink href={exitHref} variant="secondary" size="lg">
            {exitLabel}
          </ButtonLink>
          {/* Rounds that leave to a topic also offer the way home. */}
          {exitHref !== '/' && (
            <ButtonLink href="/" variant="secondary" size="lg">
              <Ui {...COPY.common.home} />
            </ButtonLink>
          )}
        </div>
      </PinnedActions>
    </div>
  );
}
