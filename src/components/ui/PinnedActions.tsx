import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface PinnedActionsProps {
  children: ReactNode;
  className?: string;
  /**
   * The last thing on the screen: the bar bleeds through the screen's bottom padding
   * too, so it meets the edge instead of floating above a strip of page.
   */
  atScreenEnd?: boolean;
}

/**
 * The buttons that end a screen. On a phone they stay pinned to the bottom of the
 * screen while the page scrolls under them, then settle in after the last line, so
 * nothing is ever hidden behind them. From md up they sit in the page.
 * Expects the game screens' padding (px-4, pb-8), which it bleeds through.
 */
export function PinnedActions({ children, className, atScreenEnd = false }: PinnedActionsProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 -mx-4 border-t-2 border-ink bg-canvas px-4 pb-safe md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0',
        atScreenEnd && 'max-md:-mb-8',
      )}
    >
      <div className={cn('flex flex-col gap-3 py-3 md:py-0', className)}>{children}</div>
    </div>
  );
}
