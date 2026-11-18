/**
 * Finding glossary terms in rule text and explanations, to link them to /glossary.
 * German terms match as written (they're capitalised nouns); English aliases match in
 * any case. Whole words only, the longest term first, and each term once per text.
 */

import type { GlossaryEntry } from '@/content/glossary';

export interface TermPart {
  text: string;
  /** Glossary id when this part is a term to link. */
  id?: string;
}

interface Matcher {
  id: string;
  phrase: string;
  ignoreCase: boolean;
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function termMatchers(entries: readonly GlossaryEntry[]): Matcher[] {
  return entries
    .flatMap((entry) => [
      { id: entry.id, phrase: entry.term, ignoreCase: false },
      ...(entry.aliases ?? []).map((phrase) => ({ id: entry.id, phrase, ignoreCase: true })),
    ])
    .sort((a, b) => b.phrase.length - a.phrase.length);
}

export function glossaryParts(text: string, matchers: readonly Matcher[]): TermPart[] {
  const found: Array<{ start: number; end: number; id: string }> = [];
  const linked = new Set<string>();
  for (const { id, phrase, ignoreCase } of matchers) {
    if (linked.has(id)) continue;
    const pattern = new RegExp(`(?<!\\p{L})${escape(phrase)}(?!\\p{L})`, ignoreCase ? 'iu' : 'u');
    const match = pattern.exec(text);
    if (!match) continue;
    const start = match.index;
    const end = start + match[0].length;
    if (found.some((f) => start < f.end && end > f.start)) continue;
    found.push({ start, end, id });
    linked.add(id);
  }
  found.sort((a, b) => a.start - b.start);
  const parts: TermPart[] = [];
  let at = 0;
  for (const { start, end, id } of found) {
    if (start > at) parts.push({ text: text.slice(at, start) });
    parts.push({ text: text.slice(start, end), id });
    at = end;
  }
  if (at < text.length) parts.push({ text: text.slice(at) });
  return parts;
}
