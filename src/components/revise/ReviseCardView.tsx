import Link from 'next/link';

import { Badge, Card, CheckIcon, CrossIcon, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';
import type { ReviseCard } from '@/lib/revise/revise-card';

interface ReviseCardViewProps {
  card: ReviseCard;
  given: string;
  misses: number;
}

export function ReviseCardView({ card, given, misses }: ReviseCardViewProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <CheckIcon className="mt-1 shrink-0 text-correct" />
        <div className="min-w-0 flex-1">
          <p lang="de" className="text-xl leading-tight font-black break-words text-ink">
            {card.correct}
          </p>
          {card.translation && <p className="text-sm text-muted">{card.translation}</p>}
        </div>
        {misses > 1 && (
          <Badge className="shrink-0">
            {misses}× <Ui {...COPY.revise.missed} />
          </Badge>
        )}
      </div>

      <p className="flex items-center gap-2 text-sm text-ink">
        <CrossIcon className="shrink-0 text-wrong" />
        <span className="text-muted">
          <Ui {...COPY.game.youChose} />:
        </span>
        <span lang="de" className="font-semibold line-through decoration-wrong">
          {given}
        </span>
      </p>

      <p className="text-sm text-ink">
        <span className="font-semibold">
          <Ui {...COPY.game.why} />{' '}
        </span>
        {card.explanation}
      </p>

      {card.alsoCorrect.length > 0 && (
        <ExampleList label={<Ui {...COPY.revise.alsoCorrect} />} items={card.alsoCorrect} />
      )}
      {card.examples.length > 0 && (
        <ExampleList label={<Ui {...COPY.revise.samePattern} />} items={card.examples} />
      )}

      <Link
        href={`/topics/${card.topicId}`}
        className="min-h-11 w-fit content-center text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
      >
        <Ui {...COPY.revise.seeRules} /> →
      </Link>
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
