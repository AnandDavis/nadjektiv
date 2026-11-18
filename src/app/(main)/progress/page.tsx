import type { Metadata } from 'next';

import { LevelCard } from '@/components/progress/LevelCard';
import { ProgressOverview } from '@/components/progress/ProgressOverview';
import { getTopicSummaries } from '@/content/summaries';

export const metadata: Metadata = { title: 'Fortschritt' };

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold text-ink">Fortschritt</h1>
      <LevelCard />
      <ProgressOverview topics={getTopicSummaries()} />
    </div>
  );
}
