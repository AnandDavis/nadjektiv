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
        'inline-flex items-center gap-1 rounded-full border border-line bg-sunken px-2.5 py-0.5 text-xs font-semibold text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
