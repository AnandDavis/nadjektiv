'use client';

import { useEffect } from 'react';

import { KEYBOARD_INSET_VAR, keyboardInset } from '@/lib/ui/keyboard-inset';

/**
 * Keeps the --keyboard-inset CSS variable equal to the height the on-screen keyboard
 * covers, from the VisualViewport API, so `bottom-keyboard` UI sits just above it.
 */
export function useKeyboardInset(): void {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const root = document.documentElement;
    const update = () => {
      const inset = keyboardInset(window.innerHeight, viewport);
      root.style.setProperty(KEYBOARD_INSET_VAR, `${inset}px`);
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      root.style.removeProperty(KEYBOARD_INSET_VAR);
    };
  }, []);
}
