'use client';

import type { ReactNode } from 'react';

import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { cn } from '@/lib/utils/cn';

/**
 * Sticks to the bottom of what's visible: the screen edge normally, the top of the
 * on-screen keyboard while one is open. Its parent must be the tall page column,
 * since a sticky element can only move within its parent.
 */
export function KeyboardDock({ children, className }: { children: ReactNode; className?: string }) {
  useKeyboardInset();
  return (
    <div data-keyboard-dock className={cn('sticky bottom-keyboard z-10 bg-canvas', className)}>
      {children}
    </div>
  );
}
