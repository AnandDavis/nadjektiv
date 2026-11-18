'use client';

import Link from 'next/link';

import { ShuffleIcon, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';

/** Mixed review appears once there is something to review. */
export function ReviewCallout() {
  const progress = useProgress();
  if (!progress || Object.keys(progress.topics).length === 0) return null;
  return (
    <Link
      href="/play/review"
      className="flex min-h-16 items-center gap-3 rounded-3xl bg-brand p-4 text-on-brand shadow-raised transition hover:brightness-105 motion-safe:active:translate-y-px"
    >
      <ShuffleIcon className="text-2xl" />
      <span className="flex-1">
        <span className="block font-display text-lg font-bold">
          <Ui {...COPY.home.review} />
        </span>
        <span className="block text-sm">Mixed review of the questions you miss most</span>
      </span>
    </Link>
  );
}
