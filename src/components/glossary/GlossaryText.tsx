import Link from 'next/link';

import { GLOSSARY } from '@/content/glossary';
import { glossaryParts, termMatchers } from '@/lib/glossary/link-terms';

const MATCHERS = termMatchers(GLOSSARY);

/** Text with its grammar terms linked to their glossary entries. */
export function GlossaryText({ text }: { text: string }) {
  return (
    <>
      {glossaryParts(text, MATCHERS).map((part, i) =>
        part.id ? (
          <Link
            key={i}
            href={`/glossary#${part.id}`}
            className="underline decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid"
          >
            {part.text}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}
