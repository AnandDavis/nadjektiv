'use client';

import { useEffect } from 'react';

import { shortcutFor, type Shortcut } from '@/lib/game/shortcuts';

function clickLast(selector: string): boolean {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const element = elements[elements.length - 1];
  if (!element) return false;
  element.click();
  return true;
}

/** Does what a tap would: clicks the on-screen control marked for the shortcut. */
function perform(shortcut: Shortcut): boolean {
  switch (shortcut.type) {
    case 'choose': {
      const choices = document.querySelectorAll<HTMLElement>(
        '[data-shortcuts="choices"] button:not(:disabled)',
      );
      const choice = choices[shortcut.index];
      choice?.click();
      return Boolean(choice);
    }
    case 'confirm':
      return clickLast('[data-shortcut="confirm"]:not(:disabled)');
    case 'hint':
      return clickLast('[data-shortcut="hint"]:not(:disabled)');
    case 'undo':
      return clickLast('[data-shortcut="undo"]:not(:disabled)');
  }
}

/** Keyboard shortcuts while a game is on screen (see lib/game/shortcuts). */
export function useGameShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const shortcut = shortcutFor({
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        isTyping: Boolean(target?.closest('input, textarea, select, [contenteditable="true"]')),
        isOnControl: Boolean(target?.closest('button, a')),
      });
      if (shortcut && perform(shortcut)) event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
