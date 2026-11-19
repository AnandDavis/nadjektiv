import type { Metadata } from 'next';

import { RecordsView, type GridLabel } from '@/components/progress/RecordsView';
import { BackLink, Ui } from '@/components/ui';
import { TOPICS } from '@/content';
import { getTopicSummaries, topicTitles } from '@/content/summaries';
import { blankCells } from '@/lib/grid/grid-round';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Records' };

export default function RecordsPage() {
  const summaries = getTopicSummaries();
  const grids: GridLabel[] = TOPICS.flatMap((topic) =>
    (topic.grids ?? []).map((grid) => ({
      id: grid.id,
      topicId: topic.id,
      title: { de: grid.titleDe, en: grid.title },
      cells: blankCells(grid).length,
    })),
  );
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <BackLink href="/progress">
          <Ui {...COPY.nav.progress} />
        </BackLink>
        <div>
          <h1 className="text-4xl leading-none font-black text-ink">
            <Ui {...COPY.records.title} />
          </h1>
          <p className="mt-1 text-muted">
            <Ui {...COPY.records.intro} />
          </p>
        </div>
      </header>
      <RecordsView
        topicIds={summaries.map((t) => t.id)}
        topicTitles={topicTitles(summaries)}
        grids={grids}
      />
    </div>
  );
}
