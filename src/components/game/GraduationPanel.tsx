import Link from 'next/link';

import { Ui } from '@/components/ui';
import { COPY, type Bilingual } from '@/lib/i18n/copy';
import type { SessionOutcome } from '@/lib/progress/apply-session';

import { TIER_MARKS } from '../progress/TierBadge';

/** What the play page knows about its topic, for the celebration. */
export interface GraduationInfo {
  tagline: Bilingual;
  /** The next topic in the syllabus, to suggest. */
  next?: { id: string; title: Bilingual };
}

interface GraduationPanelProps {
  outcome: SessionOutcome;
  topicTitles: Readonly<Record<string, Bilingual>>;
  /** For a single-topic round; mixed rounds celebrate with the title alone. */
  info?: GraduationInfo;
}

/**
 * Reaching Gemeistert in a topic, celebrated once (progress remembers it): what the
 * topic covered, the learner's numbers in it, and where to go next.
 */
export function GraduationPanel({ outcome, topicTitles, info }: GraduationPanelProps) {
  if (outcome.graduations.length === 0) return null;
  return (
    <>
      {outcome.graduations.map((topicId) => {
        const topic = outcome.progress.topics[topicId];
        const accuracy = topic && topic.answered > 0 ? topic.correct / topic.answered : 0;
        return (
          <section
            key={topicId}
            aria-labelledby={`graduated-${topicId}`}
            className="flex flex-col gap-3 bg-mastered p-5 text-canvas motion-safe:animate-rise"
          >
            <p className="text-5xl leading-none" aria-hidden="true">
              {TIER_MARKS.mastered}
            </p>
            <h3 id={`graduated-${topicId}`} className="text-3xl leading-none font-black uppercase">
              <Ui {...COPY.graduation.title} />
            </h3>
            <p className="text-lg font-extrabold">
              {topicTitles[topicId] ? <Ui {...topicTitles[topicId]} /> : topicId}
            </p>
            {info && (
              <p className="text-sm">
                <Ui {...info.tagline} />
              </p>
            )}
            {topic && (
              <p className="flex gap-6 text-sm font-bold tabular-nums">
                <span>
                  {topic.answered} <Ui {...COPY.common.answered} />
                </span>
                <span>
                  {Math.round(accuracy * 100)}% <Ui {...COPY.common.correct} />
                </span>
              </p>
            )}
            {info?.next && (
              <Link
                href={`/topics/${info.next.id}`}
                className="mt-1 flex min-h-11 items-center justify-between gap-3 bg-canvas px-4 font-extrabold text-ink hover:bg-yellow hover:text-on-yellow"
              >
                <span>
                  <span className="block text-xs tracking-widest uppercase">
                    <Ui {...COPY.graduation.next} />
                  </span>
                  <Ui {...info.next.title} />
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </section>
        );
      })}
    </>
  );
}
