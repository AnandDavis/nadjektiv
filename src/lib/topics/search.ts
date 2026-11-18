/**
 * Topic search for the home page. Every word the learner types must be the start of
 * some word in the topic's titles, tagline, keywords or id. Case is ignored and
 * umlauts match both ways: "prateritum", "praeteritum" and "Präteritum" all find
 * Präteritum, and "strasse" finds Straße.
 */

export interface SearchableTopic {
  id: string;
  level: string;
  title: string;
  titleDe: string;
  tagline: string;
  keywords: readonly string[];
}

const UMLAUT_AS_E: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue' };

/** Lowercase with ß as ss, in two spellings: umlauts dropped (a) and expanded (ae). */
function foldings(text: string): string[] {
  const lower = text.toLowerCase().replace(/ß/g, 'ss');
  const plain = lower.normalize('NFD').replace(/\p{M}/gu, '');
  const expanded = lower
    .replace(/[äöü]/g, (c) => UMLAUT_AS_E[c])
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  return plain === expanded ? [plain] : [plain, expanded];
}

function wordsOf(text: string): string[] {
  return foldings(text).flatMap((folded) => folded.split(/[^a-z0-9]+/).filter(Boolean));
}

function searchWords(topic: SearchableTopic): Set<string> {
  return new Set(
    [topic.id, topic.level, topic.title, topic.titleDe, topic.tagline, ...topic.keywords].flatMap(
      wordsOf,
    ),
  );
}

/** Topics matching the query, in their original order. An empty query matches all. */
export function searchTopics<T extends SearchableTopic>(topics: readonly T[], query: string): T[] {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...topics];
  const termFoldings = terms.map((term) => wordsOf(term));
  return topics.filter((topic) => {
    const words = [...searchWords(topic)];
    return termFoldings.every((variants) =>
      variants.some((variant) => words.some((word) => word.startsWith(variant))),
    );
  });
}
