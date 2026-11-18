'use client';

import { useMemo } from 'react';

import { ButtonLink, Card, ShuffleIcon, Ui } from '@/components/ui';
import type { Topic } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { reviseList } from '@/lib/revise/revise-list';

import { ReviseCardView } from './ReviseCardView';

interface ReviseViewProps {
  topics: Topic[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

export function ReviseView({ topics, topicTitles }: ReviseViewProps) {
  const progress = useProgress();
  const items = useMemo(
    () => (progress ? reviseList(topics, progress.revise) : null),
    [progress, topics],
  );
  const total = items?.length ?? 0;
  const hasPlayed = progress ? Object.keys(progress.topics).length > 0 : false;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.revise.title} />
          {total > 0 && (
            <span className="ml-3 inline-block bg-red px-2 align-middle text-3xl text-on-red tabular-nums">
              {total}
            </span>
          )}
        </h1>
        <p className="mt-1 text-muted">
          <Ui {...COPY.revise.intro} />
        </p>
      </header>

      {!items && <Card className="h-40 animate-pulse" aria-hidden="true" />}

      {items && total > 0 && (
        <Card className="flex flex-col gap-3 bg-yellow text-on-yellow">
          <p className="text-sm font-semibold">
            <Ui {...COPY.revise.practiseHint} />
          </p>
          {/* On yellow the usual ink button turns pale in dark mode; keep it dark. */}
          <ButtonLink
            href="/play/review"
            size="lg"
            className="bg-on-yellow text-yellow hover:bg-blue hover:text-on-blue"
          >
            <ShuffleIcon /> <Ui {...COPY.revise.practise} />
          </ButtonLink>
        </Card>
      )}

      {items && total === 0 && (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-2xl font-black text-ink uppercase">
            <Ui {...COPY.revise.empty} />
          </p>
          <p className="text-muted">
            <Ui {...COPY.revise.emptyHint} />
          </p>
          {hasPlayed && (
            <ButtonLink href="/play/review" variant="secondary">
              <ShuffleIcon /> <Ui {...COPY.revise.reviewAnyway} />
            </ButtonLink>
          )}
        </Card>
      )}

      {items && total > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map(({ card, entry }) => (
            <li key={card.questionId}>
              <ReviseCardView
                card={card}
                given={entry.given}
                misses={entry.misses}
                topicTitle={topicTitles[card.topicId]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
