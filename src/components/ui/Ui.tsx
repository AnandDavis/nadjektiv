import type { Bilingual } from '@/lib/i18n/copy';

/**
 * Renders an interface label in both languages; CSS keyed on `data-ui-lang` (set
 * before paint) hides the one the learner didn't choose. Works in server and client
 * components with no hydration mismatch, and the hidden copy is out of the
 * accessibility tree.
 */
export function Ui({ de, en }: Bilingual) {
  return (
    <>
      <span className="ui-de" lang="de">
        {de}
      </span>
      <span className="ui-en" lang="en">
        {en}
      </span>
    </>
  );
}
