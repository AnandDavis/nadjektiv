import { Button, CheckIcon, CrossIcon, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import { cn } from '@/lib/utils/cn';

interface FeedbackPanelProps {
  isCorrect: boolean;
  /** What the learner chose, shown next to the right answer when they got it wrong. */
  given: string;
  /** The right answer, shown when the learner got it wrong. */
  correctAnswer: string;
  explanation: string;
  points: number;
  onContinue: () => void;
}

/**
 * After every answer: what was right, and the rule behind it. The learner moves on
 * only when they tap Continue, so a wrong answer is always explained first.
 */
export function FeedbackPanel({
  isCorrect,
  given,
  correctAnswer,
  explanation,
  points,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border-2 p-4 motion-safe:animate-rise',
        isCorrect ? 'border-correct bg-correct-soft' : 'border-wrong bg-wrong-soft',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-2 text-lg font-bold',
          isCorrect ? 'text-correct' : 'text-wrong',
        )}
      >
        {isCorrect ? <CheckIcon /> : <CrossIcon />}
        <Ui {...(isCorrect ? COPY.game.correct : COPY.game.wrong)} />
        {isCorrect && <span>+{points}</span>}
      </p>
      {!isCorrect && (
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ink">
          <dt className="text-sm text-muted">
            <Ui {...COPY.game.youChose} />
          </dt>
          <dd lang="de" className="font-semibold line-through decoration-wrong">
            {given}
          </dd>
          <dt className="text-sm text-muted">
            <Ui {...COPY.game.answer} />
          </dt>
          <dd lang="de" className="font-semibold">
            {correctAnswer}
          </dd>
        </dl>
      )}
      <p className="mt-3 text-sm text-ink">
        <span className="font-semibold">
          <Ui {...COPY.game.why} />{' '}
        </span>
        {explanation}
      </p>
      <Button className="mt-4 w-full" size="lg" onClick={onContinue} autoFocus>
        <Ui {...COPY.game.next} />
      </Button>
    </div>
  );
}
