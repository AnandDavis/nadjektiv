import type { Question } from '@/content/types';
import { formatSentence } from '@/lib/game/check-answer';
import type { Mistake } from '@/lib/game/game-reducer';
import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

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
      <h3
        id="mistakes-heading"
        className="mb-2 border-b-4 border-ink pb-1 text-lg font-black text-ink uppercase"
      >
        <Ui {...COPY.game.mistakes} />
      </h3>
      <ul>
        {unique.map(({ item, given }) => (
          <li key={item.question.id}>
            <div className="border-b-2 border-ink py-3">
              <p lang="de" className="text-lg font-extrabold text-ink">
                {correctText(item.question)}
              </p>
              <p className="mt-1 text-sm font-bold text-wrong">
                <span className="line-through decoration-2">{given}</span>
              </p>
              <p className="mt-1 text-sm text-ink">{item.question.explanation}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
