import { Card } from '@/components/ui';
import type { Question } from '@/content/types';
import { formatSentence } from '@/lib/game/check-answer';
import type { Mistake } from '@/lib/game/game-reducer';

function correctText(question: Question): string {
  switch (question.kind) {
    case 'sort':
      return `${question.prompt.replace('___', '…')} → ${question.answer}`;
    case 'gap':
      return `${question.before}${question.answer}${question.after}`;
    case 'build':
      return formatSentence(question.tiles, question.punctuation);
    default: {
      const exhaustive: never = question;
      return String(exhaustive);
    }
  }
}

/** Every mistake from the round, with the right answer and the rule. */
export function MistakeList({ mistakes }: { mistakes: Mistake[] }) {
  const unique = mistakes.filter(
    (m, i) => mistakes.findIndex((other) => other.item.question.id === m.item.question.id) === i,
  );
  return (
    <section aria-labelledby="mistakes-heading">
      <h3 id="mistakes-heading" className="mb-2 font-display text-lg font-bold text-ink">
        Review your mistakes
      </h3>
      <ul className="flex flex-col gap-3">
        {unique.map(({ item, given }) => (
          <li key={item.question.id}>
            <Card className="p-3">
              <p className="font-semibold text-ink">{correctText(item.question)}</p>
              <p className="mt-1 text-sm text-wrong">You said: {given}</p>
              <p className="mt-1 text-sm text-muted">{item.question.explanation}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
