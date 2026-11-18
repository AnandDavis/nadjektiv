'use client';

import Link from 'next/link';

import { Ui } from '@/components/ui';
import type { TopicSummary } from '@/content/summaries';
import type { Level } from '@/content/types';
import { TIERS, TIER_LABELS, masteryFor, type Tier } from '@/lib/progress/mastery';
import type { Progress } from '@/lib/progress/types';
import { COPY } from '@/lib/i18n/copy';
import { topicHref } from '@/lib/routes';
import { cn } from '@/lib/utils/cn';

import { TIER_MARKS } from './TierBadge';

const LEVELS: readonly Level[] = ['A1', 'A2'];

/** New topics are an empty outline; each medal fills the square in its own colour. */
const TILE_CLASSES: Record<Tier, string> = {
  new: 'border-tier-new bg-surface text-muted',
  bronze: 'border-ink bg-bronze text-canvas',
  silver: 'border-ink bg-silver text-canvas',
  gold: 'border-ink bg-gold text-canvas',
  mastered: 'border-ink bg-mastered text-canvas',
};

interface TopicMapProps {
  topics: TopicSummary[];
  progress: Progress;
}

/**
 * The whole syllabus at a glance: a square per topic in learning order, filled by medal,
 * one grid per level. Each square shows its number and medal mark, and reads out its title
 * and medal, so neither colour nor shape carries the meaning alone.
 */
export function TopicMap({ topics, progress }: TopicMapProps) {
  return (
    <section aria-labelledby="map-heading" className="flex flex-col gap-3">
      <h2 id="map-heading" className="sr-only">
        <Ui {...COPY.progress.map} />
      </h2>

      {LEVELS.map((level) => (
        <div key={level} className="flex flex-col gap-2">
          <h3 className="text-2xl leading-none font-black tracking-tighter text-ink">{level}</h3>
          <ul className="grid grid-cols-6 gap-1">
            {topics
              .filter((topic) => topic.level === level)
              .map((topic) => {
                const tier = masteryFor(progress.topics[topic.id], topic.modes).tier;
                const number = String(topics.indexOf(topic) + 1).padStart(2, '0');
                return (
                  <li key={topic.id}>
                    <Link
                      href={topicHref(topic.id, 'progress')}
                      className={cn(
                        'flex aspect-square min-h-11 flex-col items-center justify-center border-2 font-black transition-colors hover:bg-yellow hover:text-on-yellow',
                        TILE_CLASSES[tier],
                      )}
                    >
                      <span aria-hidden="true" className="text-sm leading-none tabular-nums">
                        {number}
                      </span>
                      <span aria-hidden="true" className="text-base leading-none">
                        {TIER_MARKS[tier]}
                      </span>
                      <span className="sr-only">
                        <Ui
                          de={`${number} ${topic.titleDe}: ${TIER_LABELS[tier].de}`}
                          en={`${number} ${topic.title}: ${TIER_LABELS[tier].en}`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-extrabold tracking-wide text-ink uppercase">
        {TIERS.map((tier) => (
          <li key={tier} className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className={cn('flex size-5 items-center justify-center border-2', TILE_CLASSES[tier])}
            >
              {TIER_MARKS[tier]}
            </span>
            <Ui {...TIER_LABELS[tier]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
