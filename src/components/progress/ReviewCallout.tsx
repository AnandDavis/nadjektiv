'use client';

import Link from 'next/link';

import { RepeatIcon, ShuffleIcon, Ui } from '@/components/ui';
import { useProgress } from '@/hooks/useProgress';
import { COPY } from '@/lib/i18n/copy';
import { reviseCount } from '@/lib/revise/revise-groups';

const CALLOUT_CLASS =
  'flex min-h-16 items-center gap-3 border-2 border-ink bg-yellow p-4 text-on-yellow transition-colors hover:bg-ink hover:text-canvas';

/** Points at the revise list when there's something on it, otherwise at mixed review. */
export function ReviewCallout() {
  const progress = useProgress();
  if (!progress || Object.keys(progress.topics).length === 0) return null;
  const count = reviseCount(progress.revise);

  if (count > 0) {
    return (
      <Link href="/revise" className={CALLOUT_CLASS}>
        <RepeatIcon className="text-2xl" />
        <span className="flex-1">
          <span className="block text-lg font-black uppercase">
            <Ui {...COPY.revise.title} />: {count}
          </span>
          <span className="block text-sm">
            <Ui {...COPY.revise.practiseHint} />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/play/review" className={CALLOUT_CLASS}>
      <ShuffleIcon className="text-2xl" />
      <span className="flex-1">
        <span className="block text-lg font-black uppercase">
          <Ui {...COPY.home.review} />
        </span>
        <span className="block text-sm">
          <Ui {...COPY.home.reviewHint} />
        </span>
      </span>
    </Link>
  );
}
