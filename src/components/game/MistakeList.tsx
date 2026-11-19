import { Ui } from '@/components/ui';
import { answerInContext } from '@/lib/game/answer-in-context';
import type { Mistake } from '@/lib/game/game-reducer';
import { COPY } from '@/lib/i18n/copy';

/**
 * The sentence with the right answer underlined in green, and the learner's answer
 * stacked directly beneath it, struck through in red.
 */
function AnswerLine({ mistake }: { mistake: Mistake }) {
  const { before, answer, after } = answerInContext(mistake.item.question);
  return (
    <p lang="de" className="text-lg leading-relaxed font-extrabold text-ink">
      {before}
      <span className="inline-flex flex-col items-start align-top">
        <span className="underline decoration-correct decoration-4 underline-offset-4">
          <span className="sr-only">
            <Ui {...COPY.game.answer} />:{' '}
          </span>
          {answer}
        </span>
        <span className="text-sm font-bold text-wrong line-through decoration-2">
          <span className="sr-only">
            {' '}
            (<Ui {...COPY.game.youChose} />: {mistake.given})
          </span>
          <span aria-hidden="true">{mistake.given}</span>
        </span>
      </span>
      {after}
    </p>
  );
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
        {unique.map((mistake) => (
          <li key={mistake.item.question.id}>
            <div className="border-b-2 border-ink py-3">
              <AnswerLine mistake={mistake} />
              <p className="mt-1 text-sm text-ink">{mistake.item.question.explanation}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
