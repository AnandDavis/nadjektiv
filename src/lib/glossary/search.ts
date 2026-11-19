import type { GlossaryEntry } from '@/content/glossary';
import { matchesQuery } from '@/lib/topics/search';

/**
 * Glossary entries matching a search, by the German term, the English name or an alias,
 * in their original order. An empty query matches all.
 */
export function searchGlossary(entries: readonly GlossaryEntry[], query: string): GlossaryEntry[] {
  return entries.filter((entry) =>
    matchesQuery([entry.term, entry.english, ...(entry.aliases ?? [])], query),
  );
}
