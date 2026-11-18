import type { Metadata } from 'next';

import { Ui } from '@/components/ui';
import { VerbLookup } from '@/components/verbs/VerbLookup';
import { getTopicSummaries, topicTitles } from '@/content/summaries';
import { COPY } from '@/lib/i18n/copy';
import { verbEntries } from '@/lib/verbs/lookup';

export const metadata: Metadata = { title: 'Verbs' };

export default function VerbsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.verbs.title} />
        </h1>
        <p className="mt-1 text-muted">
          <Ui {...COPY.verbs.intro} />
        </p>
      </header>
      <VerbLookup verbs={verbEntries()} topicTitles={topicTitles(getTopicSummaries())} />
    </div>
  );
}
