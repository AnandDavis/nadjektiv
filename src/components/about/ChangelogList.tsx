import { Ui } from '@/components/ui';
import { CHANGELOG } from '@/content/changelog';
import { COPY } from '@/lib/i18n/copy';
import { formatUtcTimestamp } from '@/lib/utils/format-date';

export function ChangelogList() {
  return (
    <section aria-labelledby="changelog-heading">
      <h2 id="changelog-heading" className="mb-3 font-display text-xl font-bold text-ink">
        <Ui {...COPY.about.changelog} />
      </h2>
      <ol className="flex flex-col border-l-2 border-line pl-4">
        {CHANGELOG.map((entry) => (
          <li key={`${entry.date}-${entry.title}`} className="relative pb-5 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-6 size-3 rounded-full border-2 border-canvas bg-brand"
            />
            <time dateTime={entry.date} className="text-xs font-semibold text-muted">
              {formatUtcTimestamp(entry.date)}
            </time>
            <h3 className="font-display font-bold text-ink">{entry.title}</h3>
            <p className="text-sm text-ink">{entry.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
