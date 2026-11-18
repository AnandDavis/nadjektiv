import { Button, CheckIcon, CrossIcon } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface FeedbackPanelProps {
  isCorrect: boolean;
  /** The right answer, shown when the learner got it wrong. */
  correctAnswer: string;
  explanation: string;
  points: number;
  onContinue: () => void;
}

export function FeedbackPanel({
  isCorrect,
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
        {isCorrect ? `Richtig! +${points}` : 'Nicht ganz'}
      </p>
      {!isCorrect && (
        <p className="mt-1 text-ink">
          Answer: <strong>{correctAnswer}</strong>
        </p>
      )}
      <p className="mt-2 text-sm text-ink">{explanation}</p>
      <Button className="mt-4 w-full" size="lg" onClick={onContinue} autoFocus>
        Weiter
      </Button>
    </div>
  );
}
