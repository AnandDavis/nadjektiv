'use client';

import Link from 'next/link';

import { SectionHeading, Shape, Ui } from '@/components/ui';
import type { GameMode } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { MODE_INFO } from '@/lib/game/modes';
import { MODE_SHAPES } from '@/lib/ui/shapes';
import { COPY } from '@/lib/i18n/copy';

export function TopicModes({ topicId, modes }: { topicId: string; modes: GameMode[] }) {
  const progress = useProgress();
  return (
    <section aria-labelledby="play-heading">
      <SectionHeading id="play-heading">
        <Ui {...COPY.topic.play} />
      </SectionHeading>
      <ul>
        {modes.map((mode) => {
          const info = MODE_INFO[mode];
          const shape = MODE_SHAPES[mode];
          const best = progress?.topics[topicId]?.modes[mode];
          return (
            <li key={mode} className="border-b-2 border-ink">
              <Link
                href={`/play/${topicId}/${mode}`}
                className="group flex min-h-20 items-center gap-4 py-3 pr-2 transition-colors hover:bg-yellow"
              >
                <Shape kind={shape.kind} color={shape.color} className="ml-1 text-4xl" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xl leading-tight font-black text-ink uppercase group-hover:text-on-yellow">
                    {info.name}
                  </span>
                  <span className="block text-xs font-extrabold tracking-widest text-muted uppercase group-hover:text-on-yellow">
                    {info.english}
                  </span>
                  <span className="mt-1 block text-sm text-ink group-hover:text-on-yellow">
                    {info.description}
                  </span>
                </span>
                {best && (
                  <span className="shrink-0 border-2 border-ink bg-surface px-2 py-1 text-center">
                    <span className="block text-xs font-extrabold tracking-widest text-muted uppercase">
                      Best
                    </span>
                    <span className="block text-xl leading-none font-black text-ink tabular-nums">
                      {best.bestScore}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
