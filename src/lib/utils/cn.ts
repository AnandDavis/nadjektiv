import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Our design tokens, so tailwind-merge knows text-ink is a colour and not a font size. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'canvas',
        'surface',
        'sunken',
        'line',
        'ink',
        'muted',
        'blue',
        'red',
        'yellow',
        'on-blue',
        'on-red',
        'on-yellow',
        'brand',
        'brand-strong',
        'on-brand',
        'focus',
        'correct',
        'correct-soft',
        'wrong',
        'wrong-soft',
        'der',
        'die',
        'das',
        'bronze',
        'silver',
        'gold',
        'mastered',
        'tier-new',
      ],
    },
  },
});

/** Join conditional class names; later Tailwind classes override earlier conflicting ones. */
export function cn(...values: ClassValue[]): string {
  return twMerge(clsx(values));
}
