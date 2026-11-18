'use client';

import type { ComponentProps } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { ButtonLink, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';

import { GameScreen } from './GameScreen';
import { COPY } from '@/lib/i18n/copy';

type ReviewScreenProps = Omit<ComponentProps<typeof GameScreen>, 'mode'>;

/** Mixed review needs at least one played topic; otherwise point the learner at the topics. */
export function ReviewScreen(props: ReviewScreenProps) {
  const progress = useProgress();
  if (progress && Object.keys(progress.topics).length === 0) {
    return (
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-4xl leading-none font-black text-ink">
            <Ui {...COPY.game.nothingToReview} />
          </h1>
          <p className="text-muted">
            <Ui {...COPY.game.nothingToReviewHint} />
          </p>
          <ButtonLink href="/">
            <Ui {...COPY.game.chooseTopic} />
          </ButtonLink>
        </main>
      </div>
    );
  }
  return <GameScreen mode="review" {...props} />;
}
