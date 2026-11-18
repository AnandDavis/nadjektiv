export interface TextPart {
  text: string;
  isHighlight: boolean;
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split `text` around `phrases`, found in order as whole words. Returns null if any
 * phrase is missing, so content tests can catch a highlight that no longer matches.
 */
export function highlightParts(text: string, phrases: readonly string[]): TextPart[] | null {
  const parts: TextPart[] = [];
  let rest = text;
  for (const phrase of phrases) {
    const match = new RegExp(`(?<!\\p{L})${escape(phrase)}(?!\\p{L})`, 'u').exec(rest);
    if (!match) return null;
    if (match.index > 0) parts.push({ text: rest.slice(0, match.index), isHighlight: false });
    parts.push({ text: phrase, isHighlight: true });
    rest = rest.slice(match.index + phrase.length);
  }
  if (rest) parts.push({ text: rest, isHighlight: false });
  return parts;
}
