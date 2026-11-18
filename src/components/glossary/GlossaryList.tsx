import { Ui } from '@/components/ui';
import type { GlossaryEntry } from '@/content/glossary';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import { highlightParts } from '@/lib/text/highlight';

import { TopicLink } from '../topics/TopicLink';

interface GlossaryListProps {
  entries: readonly GlossaryEntry[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

const LABEL = 'text-xs font-extrabold tracking-widest text-muted uppercase';

/** The example with the words that show the term marked. */
function Example({ de, highlight }: { de: string; highlight: string[] }) {
  const parts = highlightParts(de, highlight) ?? [{ text: de, isHighlight: false }];
  return (
    <>
      {parts.map((part, i) =>
        part.isHighlight ? (
          <mark key={i} className="bg-yellow px-0.5 text-on-yellow">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

/** Every term with its explanation, an example, and links to the topics that teach it. */
export function GlossaryList({ entries, topicTitles }: GlossaryListProps) {
  return (
    <dl className="border-t-4 border-ink">
      {entries.map((entry) => (
        <div key={entry.id} id={entry.id} className="scroll-mt-20 border-b-2 border-line py-5">
          <dt>
            <span lang="de" className="block text-2xl leading-tight font-black text-ink">
              {entry.term}
            </span>
            <span className="block text-sm font-extrabold tracking-wide text-muted uppercase">
              {entry.english}
            </span>
          </dt>
          <dd className="mt-2 flex flex-col gap-3">
            <p className="text-ink">{entry.explanation}</p>
            <div className="border-2 border-ink px-3 py-2">
              <p className={LABEL}>
                <Ui {...COPY.glossary.example} />
              </p>
              <p lang="de" className="mt-1 font-bold text-ink">
                <Example de={entry.example.de} highlight={entry.example.highlight} />
              </p>
              <p className="translation text-sm text-muted">{entry.example.en}</p>
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className={LABEL}>
                <Ui {...COPY.glossary.topics} />
              </span>
              {entry.topics.map((id) => (
                <TopicLink
                  key={id}
                  topicId={id}
                  origin="glossary"
                  className="inline-flex min-h-11 items-center font-semibold text-brand-strong underline underline-offset-4"
                >
                  {topicTitles[id] ? <Ui {...topicTitles[id]} /> : id}
                </TopicLink>
              ))}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
