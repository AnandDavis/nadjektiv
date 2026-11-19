import { FoldSection, Ui } from '@/components/ui';
import { CHANGELOG } from '@/content/changelog';
import { changelogDays } from '@/lib/about/changelog-days';
import { COPY } from '@/lib/i18n/copy';
import { formatUtcDate } from '@/lib/utils/format-date';

/** What's new, newest first, one date per day with everything that shipped that day. */
export function ChangelogList() {
  return (
    <FoldSection id="changelog" title={<Ui {...COPY.about.changelog} />}>
      <ol>
        {changelogDays(CHANGELOG).map(({ day, entries }) => (
          <li
            key={day}
            className="flex flex-col gap-2 border-b-2 border-line py-4 sm:flex-row sm:gap-4"
          >
            <time
              dateTime={day}
              className="shrink-0 text-xs font-extrabold tracking-widest text-muted uppercase tabular-nums sm:w-28 sm:pt-1"
            >
              {formatUtcDate(day)}
            </time>
            <ul className="flex flex-col gap-3">
              {entries.map((entry) => (
                <li key={`${entry.date}-${entry.title}`}>
                  <h3 className="text-lg leading-tight font-black text-ink">{entry.title}</h3>
                  <p className="mt-1 text-sm text-ink">{entry.description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </FoldSection>
  );
}
