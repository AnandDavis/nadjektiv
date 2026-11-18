import { describe, expect, it } from 'vitest';

import { highlightParts } from '@/lib/text/highlight';

import { GLOSSARY } from './glossary';
import { TOPICS } from './index';

describe('glossary', () => {
  const topicIds = new Set(TOPICS.map((t) => t.id));

  it('has unique, URL-safe ids in alphabetical order of term', () => {
    const ids = GLOSSARY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    const terms = GLOSSARY.map((e) => e.term.toLowerCase());
    expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b, 'de')));
  });

  it('gives every term an explanation, a German example with its English, and real topics', () => {
    for (const entry of GLOSSARY) {
      expect(entry.explanation.length, entry.id).toBeGreaterThan(20);
      expect(entry.example.de.trim(), entry.id).not.toBe('');
      expect(entry.example.en.trim(), entry.id).not.toBe('');
      expect(entry.topics.length, entry.id).toBeGreaterThan(0);
      for (const id of entry.topics) expect(topicIds.has(id), `${entry.id} → ${id}`).toBe(true);
    }
  });

  it('highlights words that really are in each example, in order', () => {
    for (const { id, example } of GLOSSARY) {
      expect(example.highlight.length, id).toBeGreaterThan(0);
      expect(highlightParts(example.de, example.highlight), id).not.toBeNull();
    }
  });
});
