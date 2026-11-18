import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
export type ButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-extrabold uppercase tracking-wide transition-colors select-none disabled:cursor-not-allowed disabled:opacity-40 motion-safe:active:translate-y-px';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-canvas hover:bg-blue hover:text-on-blue',
  accent: 'bg-yellow text-on-yellow border-2 border-ink hover:bg-ink hover:text-canvas',
  secondary: 'border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-canvas',
  ghost: 'text-ink hover:bg-sunken',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-14 px-6 text-base',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}
