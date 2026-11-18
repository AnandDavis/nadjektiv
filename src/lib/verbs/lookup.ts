/**
 * The verb lookup: each verb's present tense, Präteritum and Perfekt together. The
 * irregular verbs come from the irregular-verbs topic's table plus their present
 * forms; modal, regular, separable and dative verbs from more-verbs.ts.
 */

import { getTopic } from '@/content';
import { MORE_VERBS, type ExtraVerb, type VerbKind } from '@/content/more-verbs';
import { VERB_FORMS, type PresentForms } from '@/content/verbs';

export interface VerbEntry {
  infinitive: string;
  gloss: string;
  kind: VerbKind;
  present: PresentForms;
  /** ich / er / sie / es form, e.g. "ging", "stand auf". */
  praeteritum: string;
  participle: string;
  auxiliary: 'haben' | 'sein';
  /** Separable, like anfangen: links to the separable verbs topic. */
  separable: boolean;
  /** Takes a dative object: links to the dative verbs topic. */
  dative: boolean;
  note?: string;
  /** Topics that practise it. */
  topicIds: string[];
}

/** Verbs from the irregular-verbs table that take a dative object. */
const DATIVE_IRREGULAR = new Set(['helfen']);

function topicsFor(entry: Omit<VerbEntry, 'topicIds'>): string[] {
  return [
    'present-tense',
    ...(entry.kind === 'modal' ? ['modal-verbs'] : []),
    ...(entry.separable ? ['separable-verbs'] : []),
    ...(entry.dative ? ['dative-verbs'] : []),
    'perfekt',
    'praeteritum',
    ...(entry.kind === 'irregular' ? ['irregular-verbs'] : []),
  ];
}

function withTopics(entry: Omit<VerbEntry, 'topicIds'>): VerbEntry {
  return { ...entry, topicIds: topicsFor(entry) };
}

function fromTable(): VerbEntry[] {
  const rows = getTopic('irregular-verbs')?.rules[0]?.table?.rows ?? [];
  return rows.flatMap(([infinitive, , praeteritum, partizip]) => {
    const forms = VERB_FORMS[infinitive];
    if (!forms) return [];
    const sein = partizip.startsWith('ist ');
    return [
      withTopics({
        infinitive,
        gloss: forms.gloss,
        kind: 'irregular',
        present: forms.present,
        praeteritum,
        participle: sein ? partizip.slice('ist '.length) : partizip,
        auxiliary: sein ? 'sein' : 'haben',
        separable: forms.present[0].includes(' '),
        dative: DATIVE_IRREGULAR.has(infinitive),
      }),
    ];
  });
}

function fromExtra(verb: ExtraVerb): VerbEntry {
  return withTopics({
    ...verb,
    separable: verb.present[0].includes(' '),
    dative: verb.dative ?? false,
  });
}

/** Every verb in the lookup, in alphabetical order. */
export function verbEntries(): VerbEntry[] {
  return [...fromTable(), ...MORE_VERBS.map(fromExtra)].sort((a, b) =>
    a.infinitive.localeCompare(b.infinitive, 'de'),
  );
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
