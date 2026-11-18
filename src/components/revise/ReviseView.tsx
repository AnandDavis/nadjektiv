'use client';

import { useMemo } from 'react';

import { ButtonLink, Card, SectionHeading, ShuffleIcon, Ui } from '@/components/ui';
import type { Topic } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { reviseGroups } from '@/lib/revise/revise-groups';

import { ReviseCardView } from './ReviseCardView';

interface ReviseViewProps {
  topics: Topic[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

export function ReviseView({ topics, topicTitles }: ReviseViewProps) {
  const progress = useProgress();
  const groups = useMemo(
    () => (progress ? reviseGroups(topics, progress.revise) : null),
    [progress, topics],
  );
  const total = groups?.reduce((sum, g) => sum + g.items.length, 0) ?? 0;
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

      {!groups && <Card className="h-40 animate-pulse" aria-hidden="true" />}

      {groups && total > 0 && (
        <Card className="flex flex-col gap-3 bg-yellow text-on-yellow">
          <p className="text-sm font-semibold">
            <Ui {...COPY.revise.practiseHint} />
          </p>
          <ButtonLink href="/play/review" size="lg">
            <ShuffleIcon /> <Ui {...COPY.revise.practise} />
          </ButtonLink>
        </Card>
      )}

      {groups && total === 0 && (
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

      {groups?.map((group) => (
        <section key={group.topicId} aria-labelledby={`revise-${group.topicId}`}>
          <SectionHeading id={`revise-${group.topicId}`}>
            {topicTitles[group.topicId] ? <Ui {...topicTitles[group.topicId]} /> : group.topicId}
          </SectionHeading>
          <ul className="flex flex-col gap-3">
            {group.items.map(({ card, entry }) => (
              <li key={card.questionId}>
                <ReviseCardView card={card} given={entry.given} misses={entry.misses} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
