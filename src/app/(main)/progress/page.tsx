import type { Metadata } from 'next';

import { LevelCard } from '@/components/progress/LevelCard';
import { ProgressOverview } from '@/components/progress/ProgressOverview';
import { getTopicSummaries } from '@/content/summaries';
import { Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Progress' };

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold text-ink">
        <Ui {...COPY.nav.progress} />
      </h1>
      <LevelCard />
      <ProgressOverview topics={getTopicSummaries()} />
    </div>
  );
}
