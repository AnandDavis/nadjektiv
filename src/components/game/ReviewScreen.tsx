'use client';

import type { ComponentProps } from 'react';

import { ButtonLink } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';

import { GameScreen } from './GameScreen';

type ReviewScreenProps = Omit<ComponentProps<typeof GameScreen>, 'mode'>;

/** Mixed review needs at least one played topic; otherwise point the learner at the topics. */
export function ReviewScreen(props: ReviewScreenProps) {
  const progress = useProgress();
  if (progress && Object.keys(progress.topics).length === 0) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Nothing to review yet</h1>
        <p className="text-muted">
          Play a topic first — review then mixes in the questions you find hardest.
        </p>
        <ButtonLink href="/">Choose a topic</ButtonLink>
      </main>
    );
  }
  return <GameScreen mode="review" {...props} />;
}
