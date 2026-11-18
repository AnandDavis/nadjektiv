import type { Metadata } from 'next';

import { GlossaryList } from '@/components/glossary/GlossaryList';
import { Ui } from '@/components/ui';
import { GLOSSARY } from '@/content/glossary';
import { getTopicSummaries, topicTitles } from '@/content/summaries';
import { COPY } from '@/lib/i18n/copy';

export const metadata: Metadata = { title: 'Glossary' };

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.glossary.title} />
        </h1>
        <p className="mt-1 text-muted">
          <Ui {...COPY.glossary.intro} />
        </p>
      </header>
      <GlossaryList entries={GLOSSARY} topicTitles={topicTitles(getTopicSummaries())} />
    </div>
  );
}
