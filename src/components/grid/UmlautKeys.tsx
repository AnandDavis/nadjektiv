'use client';

const KEYS = ['ä', 'ö', 'ü', 'ß'] as const;

interface UmlautKeysProps {
  label: string;
  onInsert: (character: string) => void;
}

/**
 * ä ö ü ß for keyboards without them. Pressing a key must not take focus away from the
 * cell being typed in, so focus is kept on pointer down.
 */
export function UmlautKeys({ label, onInsert }: UmlautKeysProps) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-4 border-2 border-ink">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          lang="de"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => onInsert(key)}
          className="min-h-12 border-l-2 border-ink bg-surface text-xl font-black text-ink transition-colors first:border-l-0 hover:bg-yellow hover:text-on-yellow"
        >
          {key}
        </button>
      ))}
    </div>
  );
}
