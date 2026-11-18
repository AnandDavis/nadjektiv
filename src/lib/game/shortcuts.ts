/**
 * Keyboard shortcuts for the games on a computer: 1–4 or the A–D letters shown on the
 * options to choose, Enter for Prüfen/Weiter, H for a hint, Backspace to take back the
 * last tile in Satzbau. Never while typing (Tippen, Tabelle) or with Ctrl/Cmd/Alt.
 */

export type Shortcut =
  { type: 'choose'; index: number } | { type: 'confirm' } | { type: 'hint' } | { type: 'undo' };

export interface KeyPress {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  /** The focus is in a text field, where every key is typing. */
  isTyping: boolean;
  /** The focus is on a button or link, which handles Enter and Space itself. */
  isOnControl: boolean;
}

const LETTERS = ['a', 'b', 'c', 'd'];
const MAX_CHOICES = 4;

export function shortcutFor(press: KeyPress): Shortcut | null {
  if (press.isTyping || press.ctrlKey || press.metaKey || press.altKey) return null;
  const key = press.key.toLowerCase();
  const digit = Number.parseInt(key, 10);
  if (key.length === 1 && digit >= 1 && digit <= MAX_CHOICES)
    return { type: 'choose', index: digit - 1 };
  if (LETTERS.includes(key)) return { type: 'choose', index: LETTERS.indexOf(key) };
  if (key === 'enter') return press.isOnControl ? null : { type: 'confirm' };
  if (key === 'h') return { type: 'hint' };
  if (key === 'backspace') return { type: 'undo' };
  return null;
}

/** The shortcuts as listed on the About page: keys and what they do. */
export const SHORTCUT_LIST = [
  { keys: '1–4 · A–D', de: 'Antwort wählen', en: 'Choose an answer' },
  { keys: 'Enter', de: 'Prüfen oder weiter', en: 'Check, or continue' },
  { keys: 'H', de: 'Hinweis zeigen', en: 'Show a hint' },
  { keys: '⌫', de: 'Letztes Wort zurücknehmen (Satzbau)', en: 'Take back the last word (Satzbau)' },
] as const;
