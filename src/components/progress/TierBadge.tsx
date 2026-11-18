import { Ui } from '@/components/ui/Ui';
import { TIER_LABELS, type Tier } from '@/lib/progress/mastery';
import { cn } from '@/lib/utils/cn';

export const TIER_CLASSES: Record<Tier, string> = {
  new: 'text-tier-new border-tier-new',
  bronze: 'text-bronze border-bronze',
  silver: 'text-silver border-silver',
  gold: 'text-gold border-gold',
  mastered: 'text-mastered border-mastered',
};

/**
 * A tier as a filled square (topic map, home list): new topics are an empty outline,
 * each medal fills the square in its own colour.
 */
export const TIER_FILLS: Record<Tier, string> = {
  new: 'border-tier-new bg-surface text-muted',
  bronze: 'border-ink bg-bronze text-canvas',
  silver: 'border-ink bg-silver text-canvas',
  gold: 'border-ink bg-gold text-canvas',
  mastered: 'border-ink bg-mastered text-canvas',
};

export const TIER_MARKS: Record<Tier, string> = {
  new: '○',
  bronze: '●',
  silver: '◆',
  gold: '★',
  mastered: '✦',
};

/** Tier shown by colour, symbol and text, so it never relies on colour alone. */
export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border-2 bg-surface px-1.5 py-0.5 text-xs font-extrabold tracking-wide uppercase',
        TIER_CLASSES[tier],
        className,
      )}
    >
      <span aria-hidden="true">{TIER_MARKS[tier]}</span>
      <Ui {...TIER_LABELS[tier]} />
    </span>
  );
}

/**
 * A tier as a fixed-size square showing only its mark, so a column of them lines up.
 * The tier's name is read out, so it never relies on colour or shape alone.
 */
export function TierSquare({
  tier,
  caption,
  className,
}: {
  tier: Tier;
  /** Shown under the mark, e.g. the topic's recent accuracy. */
  caption?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex size-12 flex-col items-center justify-center border-2 font-black',
        TIER_FILLS[tier],
        className,
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {TIER_MARKS[tier]}
      </span>
      {caption && <span className="mt-0.5 text-xs leading-none tabular-nums">{caption}</span>}
      <span className="sr-only">
        <Ui {...TIER_LABELS[tier]} />
      </span>
    </span>
  );
}
