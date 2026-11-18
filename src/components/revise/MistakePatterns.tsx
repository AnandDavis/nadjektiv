import { SectionHeading, Ui } from '@/components/ui';
import { COPY, insteadOf, missedTimes, type Bilingual } from '@/lib/i18n/copy';
import type { MistakePattern } from '@/lib/revise/patterns';
import { topicRulesHref } from '@/lib/routes';

import { TopicLink } from '../topics/TopicLink';

interface MistakePatternsProps {
  patterns: MistakePattern[];
  topicTitles: Readonly<Record<string, Bilingual>>;
}

/** The revise page's repeated mix-ups, each with the rule that explains it. */
export function MistakePatterns({ patterns, topicTitles }: MistakePatternsProps) {
  if (patterns.length === 0) return null;
  return (
    <section aria-labelledby="patterns-heading">
      <SectionHeading id="patterns-heading">
        <Ui {...COPY.patterns.title} />
      </SectionHeading>
      <p className="mb-2 text-sm text-muted">
        <Ui {...COPY.patterns.hint} />
      </p>
      <ul>
        {patterns.map((pattern) => (
          <li
            key={`${pattern.topicId}|${pattern.given}|${pattern.answer}`}
            className="flex items-center gap-3 border-b-2 border-line py-3"
          >
            <span className="min-w-0 flex-1">
              <span lang="de" className="block text-lg font-black text-ink">
                <Ui {...insteadOf(pattern.answer, pattern.given)} />
              </span>
              <span className="block text-xs font-extrabold tracking-widest text-muted uppercase">
                {topicTitles[pattern.topicId] ? (
                  <Ui {...topicTitles[pattern.topicId]} />
                ) : (
                  pattern.topicId
                )}{' '}
                · <Ui {...missedTimes(pattern.misses)} />
              </span>
            </span>
            <TopicLink
              topicId={pattern.topicId}
              origin="revise"
              href={topicRulesHref(pattern.topicId)}
              className="flex min-h-11 shrink-0 items-center text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              <Ui {...COPY.revise.seeRules} /> →
            </TopicLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
