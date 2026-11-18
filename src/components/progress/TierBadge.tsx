import { TIER_LABELS, type Tier } from '@/lib/progress/mastery';
import { cn } from '@/lib/utils/cn';

const TIER_CLASSES: Record<Tier, string> = {
  new: 'text-tier-new border-tier-new',
  bronze: 'text-bronze border-bronze',
  silver: 'text-silver border-silver',
  gold: 'text-gold border-gold',
  mastered: 'text-mastered border-mastered',
};

const TIER_MARKS: Record<Tier, string> = {
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
        'inline-flex items-center gap-1 rounded-full border-2 bg-surface px-2 py-0.5 text-xs font-bold',
        TIER_CLASSES[tier],
        className,
      )}
    >
      <span aria-hidden="true">{TIER_MARKS[tier]}</span>
      {TIER_LABELS[tier]}
    </span>
  );
}
