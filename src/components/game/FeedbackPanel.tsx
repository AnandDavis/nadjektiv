import { Button, CheckIcon, CrossIcon, Ui } from '@/components/ui';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { cn } from '@/lib/utils/cn';

interface FeedbackPanelProps {
  isCorrect: boolean;
  /** What the learner chose, shown next to the right answer when they got it wrong. */
  given: string;
  /** Label for `given`; "You chose" unless the answer was typed. */
  givenLabel?: Bilingual;
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
  givenLabel = COPY.game.youChose,
  correctAnswer,
  explanation,
  points,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <div className="border-2 border-ink bg-surface motion-safe:animate-rise">
      <p
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-lg font-black tracking-wide uppercase',
          isCorrect ? 'bg-correct text-canvas' : 'bg-red text-on-red',
        )}
      >
        {isCorrect ? <CheckIcon /> : <CrossIcon />}
        <Ui {...(isCorrect ? COPY.game.correct : COPY.game.wrong)} />
        {isCorrect && <span className="ml-auto tabular-nums">+{points}</span>}
      </p>
      <div className="p-4">
        {!isCorrect && (
          <dl className="mb-3 flex flex-col gap-1 border-b-2 border-ink pb-3 text-ink">
            <div className="flex items-baseline gap-4">
              <dt className="w-24 shrink-0 text-xs font-extrabold tracking-widest text-muted uppercase">
                <Ui {...givenLabel} />
              </dt>
              <dd
                lang="de"
                className="text-lg font-extrabold line-through decoration-red decoration-2"
              >
                {given}
              </dd>
            </div>
            <div className="flex items-baseline gap-4">
              <dt className="w-24 shrink-0 text-xs font-extrabold tracking-widest text-muted uppercase">
                <Ui {...COPY.game.answer} />
              </dt>
              <dd lang="de" className="text-lg font-extrabold">
                {correctAnswer}
              </dd>
            </div>
          </dl>
        )}
        <p className="text-sm text-ink">
          <span className="font-extrabold">
            <Ui {...COPY.game.why} />{' '}
          </span>
          {explanation}
        </p>
        <Button className="mt-4 w-full" size="lg" onClick={onContinue} autoFocus>
          <Ui {...COPY.game.next} />
        </Button>
      </div>
    </div>
  );
}
