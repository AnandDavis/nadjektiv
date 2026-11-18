import { SectionHeading, Ui } from '@/components/ui';
import { CHANGELOG } from '@/content/changelog';
import { COPY } from '@/lib/i18n/copy';
import { formatUtcTimestamp } from '@/lib/utils/format-date';

export function ChangelogList() {
  return (
    <section aria-labelledby="changelog-heading">
      <SectionHeading id="changelog-heading">
        <Ui {...COPY.about.changelog} />
      </SectionHeading>
      <ol>
        {CHANGELOG.map((entry) => (
          <li
            key={`${entry.date}-${entry.title}`}
            className="flex flex-col gap-1 border-b-2 border-ink py-3 sm:flex-row sm:gap-4"
          >
            <time
              dateTime={entry.date}
              className="shrink-0 text-xs font-extrabold tracking-widest text-muted uppercase tabular-nums sm:w-36 sm:pt-1"
            >
              {formatUtcTimestamp(entry.date)}
            </time>
            <div>
              <h3 className="text-lg leading-tight font-black text-ink">{entry.title}</h3>
              <p className="mt-1 text-sm text-ink">{entry.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
