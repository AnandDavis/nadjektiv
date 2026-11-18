/**
 * Type `text` into an input at its caret, as a keyboard would: natively, so the text
 * and the caret move together, then announced with an input event so React's
 * onChange sees it. Moving the caret after React re-renders instead races with fast
 * typing. Used by the ä ö ü ß keys.
 */
export function insertAtCaret(input: HTMLInputElement, text: string): void {
  input.focus();
  input.setRangeText(
    text,
    input.selectionStart ?? input.value.length,
    input.selectionEnd ?? input.value.length,
    'end',
  );
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
