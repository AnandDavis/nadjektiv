/**
 * Typing into a text field from the app's own keyboard: what a key press does to the
 * field's text and selection, as the system keyboard would.
 */

export interface FieldState {
  value: string;
  /** Selection start and end; equal when it's just a caret. */
  start: number;
  end: number;
}

export type KeyAction = { type: 'insert'; text: string } | { type: 'backspace' };

export interface EditResult {
  value: string;
  /** Where the caret goes after the edit. */
  caret: number;
}

export function applyKey(field: FieldState, action: KeyAction): EditResult {
  const length = field.value.length;
  const start = Math.max(0, Math.min(field.start, field.end, length));
  const end = Math.min(length, Math.max(field.start, field.end));
  if (action.type === 'insert') {
    return {
      value: field.value.slice(0, start) + action.text + field.value.slice(end),
      caret: start + action.text.length,
    };
  }
  // Backspace deletes the selection, or else the character before the caret.
  if (start !== end)
    return { value: field.value.slice(0, start) + field.value.slice(end), caret: start };
  if (start === 0) return { value: field.value, caret: 0 };
  return { value: field.value.slice(0, start - 1) + field.value.slice(start), caret: start - 1 };
}
