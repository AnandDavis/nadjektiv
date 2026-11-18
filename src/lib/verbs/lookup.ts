/**
 * The verb lookup: each irregular verb's present tense, Präteritum and Perfekt
 * together, built from the irregular-verbs topic's table and the present forms.
 */

import { getTopic } from '@/content';
import { VERB_FORMS, type PresentForms } from '@/content/verbs';

export interface VerbEntry {
  infinitive: string;
  gloss: string;
  present: PresentForms;
  /** ich / er / sie / es form, e.g. "ging", "stand auf". */
  praeteritum: string;
  participle: string;
  auxiliary: 'haben' | 'sein';
  /** Separable, like anfangen: links to the separable verbs topic. */
  separable: boolean;
  /** Topics that practise it. */
  topicIds: string[];
}

/** Every verb in the irregular-verbs table that has present forms, in table order. */
export function verbEntries(): VerbEntry[] {
  const rows = getTopic('irregular-verbs')?.rules[0]?.table?.rows ?? [];
  return rows.flatMap(([infinitive, , praeteritum, partizip]) => {
    const forms = VERB_FORMS[infinitive];
    if (!forms) return [];
    const sein = partizip.startsWith('ist ');
    const separable = forms.present[0].includes(' ');
    return [
      {
        infinitive,
        gloss: forms.gloss,
        present: forms.present,
        praeteritum,
        participle: sein ? partizip.slice('ist '.length) : partizip,
        auxiliary: sein ? 'sein' : 'haben',
        separable,
        topicIds: [
          'present-tense',
          ...(separable ? ['separable-verbs'] : []),
          'perfekt',
          'praeteritum',
          'irregular-verbs',
        ],
      },
    ];
  });
}

function fold(text: string): string {
  return text.normalize('NFC').trim().toLowerCase();
}

/**
 * Verbs matching a search: by infinitive or English first, then by any form, so
 * "ging" finds gehen and "go" finds gehen too.
 */
export function searchVerbs(entries: readonly VerbEntry[], query: string): VerbEntry[] {
  const q = fold(query);
  if (!q) return [...entries];
  const forms = (e: VerbEntry) => [...e.present, e.praeteritum, e.participle].map(fold);
  const byName = entries.filter((e) => fold(e.infinitive).includes(q) || fold(e.gloss).includes(q));
  const byForm = entries.filter(
    (e) =>
      !byName.includes(e) && forms(e).some((form) => form.split(' ').includes(q) || form === q),
  );
  return [...byName, ...byForm];
}
