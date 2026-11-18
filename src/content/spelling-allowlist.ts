/**
 * Words the German spellcheck (src/content/spelling.test.ts) accepts although the
 * Hunspell dictionary doesn't know them. Keep this short: compounds are split
 * automatically, so only add names and genuinely missing words, with a reason.
 */
export const SPELLING_ALLOWLIST: ReadonlySet<string> = new Set([
  // People and pets used in example sentences.
  'Ali',
  'Amir',
  'Bello',
  'García',
  'Lea',
  'Lena',
  'Mia',
  // Places.
  'Ostsee',
  // Valid forms the dictionary lacks.
  'Beeil', // du-imperative of sich beeilen: "Beeil dich!"
  'leidtun', // post-1996 spelling of "leid tun"
  'Modalverb', // grammar term (das Modalverb), in the glossary
  'Neujahr',
  // Grammar terms used in topic titles.
  'Konnektoren',
  'Modalverben',
]);
