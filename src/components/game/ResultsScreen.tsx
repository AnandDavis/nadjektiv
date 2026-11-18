import Link from 'next/link';

import { Button, ButtonLink, Card, RepeatIcon, TrophyIcon, Ui } from '@/components/ui';
import { TierBadge } from '@/components/progress/TierBadge';
import type { Mistake } from '@/lib/game/game-reducer';
import { resultHeadline } from '@/lib/game/result-headline';
import { accuracy, type AnswerRecord } from '@/lib/game/scoring';
import type { BestKind, SessionOutcome } from '@/lib/progress/apply-session';
import { COPY } from '@/lib/i18n/copy';
import { levelForXp } from '@/lib/progress/level';
import { cn } from '@/lib/utils/cn';

import { MistakeList } from './MistakeList';

interface ResultsScreenProps {
  score: number;
  answers: AnswerRecord[];
  mistakes: Mistake[];
  outcome: SessionOutcome | null;
  exitHref: string;
  exitLabel: string;
  topicTitles: Readonly<Record<string, string>>;
  onPlayAgain: () => void;
}

const BEST_LABELS: Record<BestKind, string> = {
  score: 'New best score!',
  accuracy: 'New best accuracy!',
  combo: 'New best combo!',
};

export function ResultsScreen({
  score,
  answers,
  mistakes,
  outcome,
  exitHref,
  exitLabel,
  topicTitles,
  onPlayAgain,
}: ResultsScreenProps) {
  const correct = answers.filter((a) => a.isCorrect).length;
  const percent = Math.round(accuracy(answers) * 100);

  return (
    <div className="flex flex-col gap-5 motion-safe:animate-rise">
      <div>
        <h2 className="text-5xl leading-none font-black text-ink uppercase">
          <Ui {...resultHeadline(answers)} />
        </h2>
        <p className="mt-2 text-sm font-extrabold tracking-widest text-muted uppercase">
          {correct} of {answers.length} correct
        </p>
      </div>

      <div className="grid grid-cols-3 border-2 border-ink">
        <ResultStat label="Correct" value={`${percent}%`} />
        <ResultStat label="Points" value={String(score)} />
        <ResultStat
          label="XP"
          value={`+${outcome?.xpGained ?? 0}`}
          className="bg-yellow text-on-yellow"
        />
      </div>

      {outcome && <Celebrations outcome={outcome} topicTitles={topicTitles} />}

      {outcome && <ReviseNote added={outcome.addedToRevise} cleared={outcome.clearedFromRevise} />}

      {mistakes.length > 0 && <MistakeList mistakes={mistakes} />}

      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href={exitHref} variant="secondary" size="lg">
          {exitLabel}
        </ButtonLink>
        <Button size="lg" onClick={onPlayAgain} autoFocus>
          Play again
        </Button>
      </div>
    </div>
  );
}

/** Tells the learner where their mistakes went, and which ones they've now fixed. */
function ReviseNote({ added, cleared }: { added: number; cleared: number }) {
  if (added === 0 && cleared === 0) return null;
  return (
    <Link
      href="/revise"
      className="flex min-h-11 items-center gap-3 border-2 border-ink bg-surface p-3 text-sm text-ink transition-colors hover:bg-ink hover:text-canvas"
    >
      <RepeatIcon className="shrink-0 text-xl" />
      <span className="flex-1">
        {added > 0 && (
          <span className="block">
            <strong>{added}</strong> <Ui {...COPY.revise.added} />
          </span>
        )}
        {cleared > 0 && (
          <span className="block">
            <strong>{cleared}</strong> <Ui {...COPY.revise.cleared} />
          </span>
        )}
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function Celebrations({
  outcome,
  topicTitles,
}: {
  outcome: SessionOutcome;
  topicTitles: Readonly<Record<string, string>>;
}) {
  const items: React.ReactNode[] = [];
  if (outcome.levelUp) {
    const { level, title } = levelForXp(outcome.progress.xp);
    items.push(
      <li key="level">
        Level up! You’re now level {level},{' '}
        <strong>
          <Ui {...title} />
        </strong>
        .
      </li>,
    );
  }
  for (const kind of outcome.newBests) {
    items.push(<li key={kind}>{BEST_LABELS[kind]}</li>);
  }
  for (const up of outcome.tierUps) {
    items.push(
      <li key={up.topicId} className="flex flex-wrap items-center gap-2">
        {topicTitles[up.topicId] ?? up.topicId} reached <TierBadge tier={up.to} />
      </li>,
    );
  }
  if (items.length === 0) return null;
  return (
    <Card className="p-0" role="status">
      <p className="flex items-center gap-2 bg-blue px-3 py-1.5 text-sm font-extrabold tracking-widest text-on-blue uppercase">
        <TrophyIcon /> <Ui {...COPY.game.achievements} />
      </p>
      <ul className="flex flex-col gap-1 p-3 font-semibold text-ink">{items}</ul>
    </Card>
  );
}

function ResultStat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('border-l-2 border-ink p-3 first:border-l-0', className)}>
      <p className="text-3xl leading-none font-black tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-extrabold tracking-widest uppercase">{label}</p>
    </div>
  );
}
