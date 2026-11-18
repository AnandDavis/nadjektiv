'use client';

import type { ReactNode } from 'react';

import { useUiLanguage } from '@/hooks/useUiLanguage';
import { COPY } from '@/lib/i18n/copy';
import type { KeyAction } from '@/lib/text/caret-edit';
import { cn } from '@/lib/utils/cn';

// QWERTZ, with ä ö and ü ß on either side of the space bar, in easy reach.
const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
] as const;
const BEFORE_SPACE = ['ä', 'ö'] as const;
const AFTER_SPACE = ['ü', 'ß'] as const;

const KEY =
  'flex min-h-14 min-w-0 flex-1 items-center justify-center bg-sunken text-xl font-black text-ink uppercase transition-colors select-none active:bg-ink active:text-canvas';

interface OnScreenKeyboardProps {
  onKey: (action: KeyAction) => void;
  onEnter: () => void;
  /** What Enter shows: a short word ("Prüfen") or a symbol. */
  enterLabel: ReactNode;
  /** Spoken name for Enter when it shows a symbol. */
  enterName?: string;
  /** Disables Enter, e.g. while the answer is empty. */
  canEnter?: boolean;
}

/**
 * The app's own German keyboard, laid out like a phone's (delete and Enter either side
 * of the bottom letter row, ä ö ü ß either side of the space bar), so typing never opens the system keyboard: no page jumps, and ä ö ü ß
 * are ordinary keys. Keys keep focus in the field (pointer-down is cancelled) so its
 * caret stays where the learner put it.
 */
export function OnScreenKeyboard({
  onKey,
  onEnter,
  enterLabel,
  enterName,
  canEnter = true,
}: OnScreenKeyboardProps) {
  const [language] = useUiLanguage();
  const keep = (event: React.PointerEvent) => event.preventDefault();
  const letter = (key: string) => (
    <button
      key={key}
      type="button"
      lang="de"
      aria-label={key}
      onPointerDown={keep}
      onClick={() => onKey({ type: 'insert', text: key })}
      className={KEY}
    >
      {/* ß has no single-letter capital in this font; show it as typed. */}
      {key === 'ß' ? <span className="normal-case">ß</span> : key}
    </button>
  );

  return (
    <div role="group" aria-label={COPY.keys.label[language]} className="flex flex-col gap-1.5">
      <div className="flex gap-1">{ROWS[0].map(letter)}</div>
      {/* Inset by half a key, as on a phone. */}
      <div className="flex gap-1 px-4">{ROWS[1].map(letter)}</div>
      <div className="flex gap-1">
        <button
          type="button"
          onPointerDown={keep}
          onClick={() => onKey({ type: 'backspace' })}
          aria-label={COPY.keys.backspace[language]}
          className={cn(KEY, 'flex-2')}
        >
          ⌫
        </button>
        {ROWS[2].map(letter)}
        <button
          type="button"
          onPointerDown={keep}
          onClick={onEnter}
          disabled={!canEnter}
          aria-label={enterName}
          className={cn(
            KEY,
            'flex-2 bg-ink text-xs text-canvas disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {enterLabel}
        </button>
      </div>
      <div className="flex gap-1">
        {BEFORE_SPACE.map(letter)}
        <button
          type="button"
          onPointerDown={keep}
          onClick={() => onKey({ type: 'insert', text: ' ' })}
          aria-label={COPY.keys.space[language]}
          className={cn(KEY, 'flex-4')}
        />
        {AFTER_SPACE.map(letter)}
      </div>
    </div>
  );
}
