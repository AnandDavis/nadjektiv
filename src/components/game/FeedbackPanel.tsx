import { Button, CheckIcon, CrossIcon, Ui } from '@/components/ui';
import type { DiffWord, WordDiff } from '@/lib/game/word-diff';
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
  /** Sentence builder: which words were out of place, to mark just those. */
  diff?: WordDiff;
  explanation: string;
  points: number;
  onContinue: () => void;
}

const LABEL = 'w-24 shrink-0 text-xs font-extrabold tracking-widest text-muted uppercase';

/** A built sentence with the out-of-place words struck (given) or underlined (answer). */
function DiffWords({ words, mark }: { words: DiffWord[]; mark: 'strike' | 'underline' }) {
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span
            className={cn(
              !word.isRight && mark === 'strike' && 'line-through decoration-red decoration-4',
              !word.isRight &&
                mark === 'underline' &&
                'underline decoration-correct decoration-4 underline-offset-4',
            )}
          >
            {word.text}
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * After every answer: the rule behind it first, where the eye lands, then what was
 * chosen and what was right. The learner moves on only when they tap Continue, so a
 * wrong answer is always explained first.
 */
export function FeedbackPanel({
  isCorrect,
  given,
  givenLabel = COPY.game.youChose,
  correctAnswer,
  diff,
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
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-yellow px-4 py-3 text-on-yellow">
          <p className="text-xs font-extrabold tracking-widest uppercase">
            <Ui {...COPY.game.why} />
          </p>
          <p className="mt-1 text-lg leading-snug font-bold">{explanation}</p>
        </div>
        {!isCorrect && (
          <dl className="flex flex-col gap-1 text-ink">
            <div className="flex items-baseline gap-4">
              <dt className={LABEL}>
                <Ui {...givenLabel} />
              </dt>
              <dd lang="de" className="text-lg font-extrabold">
                {diff ? (
                  <DiffWords words={diff.given} mark="strike" />
                ) : (
                  <span className="line-through decoration-red decoration-4">{given}</span>
                )}
              </dd>
            </div>
            <div className="flex items-baseline gap-4">
              <dt className={LABEL}>
                <Ui {...COPY.game.answer} />
              </dt>
              <dd lang="de" className="text-lg font-extrabold">
                {diff ? <DiffWords words={diff.answer} mark="underline" /> : correctAnswer}
              </dd>
            </div>
          </dl>
        )}
        <Button className="w-full" size="lg" onClick={onContinue} autoFocus>
          <Ui {...COPY.game.next} />
        </Button>
      </div>
    </div>
  );
}
