import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

/** A flat block with an ink border. Use for bounded objects, not for list rows. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-2 border-ink bg-surface p-4', className)} {...props} />;
}
