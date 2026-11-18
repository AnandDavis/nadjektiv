import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border border-ink px-1.5 py-0.5 text-xs font-extrabold tracking-wide text-ink uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
