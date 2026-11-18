/**
 * Checking a typed grid cell. Forgiving about case, spacing and the hyphen on endings;
 * strict about spelling, so "ae" never counts for "ä" and "ss" never for "ß".
 */

import type { GridCell } from '@/content/types';

export function normaliseAnswer(text: string): string {
  return text
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[-‑–]\s*/, '')
    .toLowerCase();
}

export function isCellCorrect(cell: GridCell, typed: string): boolean {
  const attempt = normaliseAnswer(typed);
  if (attempt === '') return false;
  return [cell.answer, ...(cell.accepted ?? [])].some(
    (answer) => normaliseAnswer(answer) === attempt,
  );
}
