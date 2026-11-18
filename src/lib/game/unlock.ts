import type { GameMode } from '@/content/types';
import { masteryFor } from '@/lib/progress/mastery';
import type { TopicProgress } from '@/lib/progress/types';

/** Modes that open only once the topic has a medal: recall is for after recognition. */
const NEEDS_MEDAL: ReadonlySet<GameMode> = new Set(['type']);

/**
 * Whether a mode can be played yet. Undefined progress (still loading, or never
 * played) means no medal yet.
 */
export function isModeUnlocked(
  mode: GameMode,
  progress: TopicProgress | undefined,
  modes: readonly GameMode[],
): boolean {
  return !NEEDS_MEDAL.has(mode) || masteryFor(progress, modes).tier !== 'new';
}
