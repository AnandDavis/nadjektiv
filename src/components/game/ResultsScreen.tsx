import Link from 'next/link';

import { Button, ButtonLink, Card, RepeatIcon, TrophyIcon, Ui } from '@/components/ui';
import { TierBadge } from '@/components/progress/TierBadge';
import type { Mistake } from '@/lib/game/game-reducer';
import { resultHeadline } from '@/lib/game/result-headline';
import { accuracy, type AnswerRecord } from '@/lib/game/scoring';
import type { BestKind, SessionOutcome } from '@/lib/progress/apply-session';
import { COPY } from '@/lib/i18n/copy';
import { levelForXp } from '@/lib/progress/level';

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
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink">
          <Ui {...resultHeadline(answers)} />
        </h2>
        <p className="mt-1 text-muted">
          {correct} of {answers.length} correct · {percent}%
        </p>
      </div>

      <Card className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold text-ink tabular-nums">{score}</p>
          <p className="text-sm text-muted">points</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-brand-strong tabular-nums">
            +{outcome?.xpGained ?? 0}
          </p>
          <p className="text-sm text-muted">XP</p>
        </div>
      </Card>

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
      className="flex min-h-11 items-center gap-3 rounded-3xl border-2 border-line bg-surface p-3 text-sm text-ink hover:bg-sunken"
    >
      <RepeatIcon className="shrink-0 text-xl text-brand-strong" />
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
    <Card className="border-brand bg-sunken" role="status">
      <p className="mb-2 flex items-center gap-2 font-bold text-ink">
        <TrophyIcon className="text-brand-strong" /> <Ui {...COPY.game.achievements} />
      </p>
      <ul className="flex flex-col gap-1 text-ink">{items}</ul>
    </Card>
  );
}
