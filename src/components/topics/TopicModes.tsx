'use client';

import Link from 'next/link';

import { BlocksIcon, BoltIcon, GapIcon } from '@/components/ui';
import type { GameMode } from '@/content/types';
import { useProgress } from '@/hooks/useProgress';
import { MODE_INFO } from '@/lib/game/modes';

const MODE_ICONS: Record<GameMode, typeof BoltIcon> = {
  sort: BoltIcon,
  gap: GapIcon,
  build: BlocksIcon,
};

export function TopicModes({ topicId, modes }: { topicId: string; modes: GameMode[] }) {
  const progress = useProgress();
  return (
    <section aria-labelledby="play-heading">
      <h2 id="play-heading" className="mb-3 font-display text-xl font-bold text-ink">
        Spielen
      </h2>
      <ul className="flex flex-col gap-3">
        {modes.map((mode) => {
          const Icon = MODE_ICONS[mode];
          const info = MODE_INFO[mode];
          const best = progress?.topics[topicId]?.modes[mode];
          return (
            <li key={mode}>
              <Link
                href={`/play/${topicId}/${mode}`}
                className="flex min-h-20 items-center gap-4 rounded-3xl border-2 border-line bg-surface p-4 shadow-raised transition hover:bg-sunken motion-safe:active:translate-y-px"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-2xl text-on-brand">
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold text-ink">
                    {info.name}{' '}
                    <span className="text-sm font-semibold text-muted">· {info.english}</span>
                  </span>
                  <span className="block text-sm text-muted">{info.description}</span>
                </span>
                {best && (
                  <span className="shrink-0 text-right text-xs text-muted">
                    Best
                    <span className="block text-lg font-bold text-ink tabular-nums">
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
