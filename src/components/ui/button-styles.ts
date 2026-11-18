import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition select-none disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:translate-y-px';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand shadow-raised hover:brightness-105',
  secondary: 'border-2 border-line bg-surface text-ink hover:bg-sunken',
  ghost: 'text-ink hover:bg-sunken',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 text-base',
  lg: 'min-h-14 px-6 text-lg',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}
