import { describe, expect, it, vi } from 'vitest';

import { insertAtCaret } from './insert-at-caret';

describe('insertAtCaret', () => {
  it('replaces the selection, moves the caret after it, and fires input', () => {
    const input = document.createElement('input');
    document.body.append(input);
    input.value = 'grsse';
    input.setSelectionRange(2, 4);
    const onInput = vi.fn();
    input.addEventListener('input', onInput);

    insertAtCaret(input, 'ö');
    expect(input.value).toBe('gröe');
    expect(input.selectionStart).toBe(3);
    expect(onInput).toHaveBeenCalledOnce();
    input.remove();
  });
});
