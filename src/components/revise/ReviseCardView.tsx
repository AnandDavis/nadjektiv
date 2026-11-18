import { Badge, Card, CheckIcon, CrossIcon, Ui } from '@/components/ui';
import { COPY, missedTimes, type Bilingual } from '@/lib/i18n/copy';
import { diffClosest } from '@/lib/game/word-diff';
import type { ReviseCard } from '@/lib/revise/revise-card';
import { topicRulesHref } from '@/lib/routes';

import { GlossaryText } from '../glossary/GlossaryText';
import { TopicLink } from '../topics/TopicLink';

interface ReviseCardViewProps {
  card: ReviseCard;
  given: string;
  misses: number;
  /** Shown above the card, since the list is sorted by misses rather than grouped. */
  topicTitle?: Bilingual;
}

const RIGHT_MARK = 'underline decoration-correct decoration-4 underline-offset-4';
const WRONG_MARK = 'underline decoration-wrong decoration-4 underline-offset-4';

/**
 * The correct form with the part that was asked for underlined: the answer itself, or
 * for a built sentence the words that were out of place in what was chosen.
 */
function CorrectForm({ card, given }: { card: ReviseCard; given: string }) {
  if (card.correctParts) {
    return (
      <>
        {card.correctParts.map((part, i) =>
          part.isAnswer ? (
            <span key={i} className={RIGHT_MARK}>
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </>
    );
  }
  return (
    <>
      {diffClosest(given, card.correctOrders ?? [card.correct]).answer.map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className={word.isRight ? undefined : RIGHT_MARK}>{word.text}</span>
        </span>
      ))}
    </>
  );
}

export function ReviseCardView({ card, given, misses, topicTitle }: ReviseCardViewProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-xs font-extrabold tracking-widest text-muted uppercase">
          {topicTitle && <Ui {...topicTitle} />}
        </p>
        {misses > 0 && (
          <Badge className="shrink-0">
            <Ui {...missedTimes(misses)} />
          </Badge>
        )}
      </div>
      <div className="flex items-start gap-2">
        <CheckIcon className="mt-1 shrink-0 text-correct" />
        <div className="min-w-0 flex-1">
          {/* Above the German, so the answer's underline never runs into it. */}
          {card.translation && (
            <p className="translation mb-1 text-sm text-muted">{card.translation}</p>
          )}
          <p lang="de" className="text-xl leading-snug font-black break-words text-ink">
            <CorrectForm card={card} given={given} />
          </p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-sm text-ink">
        <CrossIcon className="shrink-0 text-wrong" />
        <span className="text-muted">
          <Ui {...COPY.game.youChose} />:
        </span>
        {given.trim() ? (
          <span lang="de" className={`font-semibold ${WRONG_MARK}`}>
            {given}
          </span>
        ) : (
          <span className="font-semibold">–</span>
        )}
      </p>

      <div>
        <p className="text-xs font-extrabold tracking-widest text-ink uppercase">
          <Ui {...COPY.game.why} />
        </p>
        <p className="mt-1 text-sm text-ink">
          <GlossaryText text={card.explanation} />
        </p>
      </div>

      {card.alsoCorrect.length > 0 && (
        <ExampleList label={<Ui {...COPY.revise.alsoCorrect} />} items={card.alsoCorrect} />
      )}
      {card.examples.length > 0 && (
        <ExampleList
          label={
            <Ui
              {...(card.examplesKind === 'row' ? COPY.revise.wholeRow : COPY.revise.samePattern)}
            />
          }
          items={card.examples}
        />
      )}

      <TopicLink
        topicId={card.topicId}
        origin="revise"
        href={topicRulesHref(card.topicId)}
        className="min-h-11 w-fit content-center text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
      >
        <Ui {...COPY.revise.seeRules} /> →
      </TopicLink>
    </Card>
  );
}

function ExampleList({ label, items }: { label: React.ReactNode; items: string[] }) {
  return (
    <div className="border-2 border-ink px-3 py-2">
      <p className="text-xs font-extrabold tracking-widest text-muted uppercase">{label}</p>
      <ul className="mt-1 flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item} lang="de" className="text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
