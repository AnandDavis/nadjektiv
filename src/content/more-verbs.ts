/**
 * Verbs in the lookup beyond the irregular-verbs table: modal verbs, common regular
 * and separable verbs, and verbs that take the dative. Irregular ones are written out
 * in full; regular ones are built by regularVerb() from the rules for regular verbs,
 * which more-verbs.test.ts pins down form by form.
 */

import type { PresentForms } from './verbs';

export type VerbKind = 'irregular' | 'modal' | 'regular';

export interface ExtraVerb {
  infinitive: string;
  gloss: string;
  kind: VerbKind;
  present: PresentForms;
  /** ich / er / sie / es form. */
  praeteritum: string;
  participle: string;
  auxiliary: 'haben' | 'sein';
  /** Takes a dative object (helfen, gefallen …). */
  dative?: boolean;
  /** A word on how the verb is used, shown with its forms. */
  note?: string;
}

/** Prefixes that keep ge- out of the participle: besucht, erklärt, verstanden. */
const INSEPARABLE = /^(be|emp|ent|er|ge|miss|ver|zer)/;

/**
 * A regular verb's forms. The stem takes an extra -e- before -st, -t and -te when it
 * ends in -t or -d, or in -m/-n after another consonant (arbeitest, wartete). A stem
 * ending in s, ß, x or z takes only -t for du (du tanzt). A separable prefix goes to
 * the end in the present and Präteritum, and before ge- in the participle.
 */
export function regularVerb(
  infinitive: string,
  gloss: string,
  options: { prefix?: string; auxiliary?: 'haben' | 'sein'; dative?: boolean } = {},
): ExtraVerb {
  const prefix = options.prefix ?? '';
  const base = infinitive.slice(prefix.length);
  const stem = base.replace(/e?n$/, '');
  const extraE = /[td]$|[^aeiouhlr][mn]$/.test(stem);
  const sibilant = /[sßxz]$/.test(stem);
  const t = extraE ? 'et' : 't';
  const after = prefix ? ` ${prefix}` : '';
  const ge = INSEPARABLE.test(base) || base.endsWith('ieren') ? '' : 'ge';
  return {
    infinitive,
    gloss,
    kind: 'regular',
    present: [
      `${stem}e${after}`,
      `${stem}${extraE ? 'est' : sibilant ? 't' : 'st'}${after}`,
      `${stem}${t}${after}`,
      `${base}${after}`,
      `${stem}${t}${after}`,
      `${base}${after}`,
    ],
    praeteritum: `${stem}${extraE ? 'ete' : 'te'}${after}`,
    participle: `${prefix}${ge}${stem}${t}`,
    auxiliary: options.auxiliary ?? 'haben',
    ...(options.dative ? { dative: true } : {}),
  };
}

const MODAL_NOTE = 'Usually with a second verb, in the infinitive, at the end of the sentence.';

export const MORE_VERBS: readonly ExtraVerb[] = [
  // Modal verbs
  {
    infinitive: 'können',
    gloss: 'can, to be able to',
    kind: 'modal',
    present: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'],
    praeteritum: 'konnte',
    participle: 'gekonnt',
    auxiliary: 'haben',
    note: MODAL_NOTE,
  },
  {
    infinitive: 'müssen',
    gloss: 'must, to have to',
    kind: 'modal',
    present: ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'],
    praeteritum: 'musste',
    participle: 'gemusst',
    auxiliary: 'haben',
    note: MODAL_NOTE,
  },
  {
    infinitive: 'dürfen',
    gloss: 'may, to be allowed to',
    kind: 'modal',
    present: ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'],
    praeteritum: 'durfte',
    participle: 'gedurft',
    auxiliary: 'haben',
    note: MODAL_NOTE,
  },
  {
    infinitive: 'sollen',
    gloss: 'should, to be supposed to',
    kind: 'modal',
    present: ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'],
    praeteritum: 'sollte',
    participle: 'gesollt',
    auxiliary: 'haben',
    note: MODAL_NOTE,
  },
  {
    infinitive: 'wollen',
    gloss: 'to want to',
    kind: 'modal',
    present: ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'],
    praeteritum: 'wollte',
    participle: 'gewollt',
    auxiliary: 'haben',
    note: MODAL_NOTE,
  },
  {
    infinitive: 'möchten',
    gloss: 'would like to',
    kind: 'modal',
    present: ['möchte', 'möchtest', 'möchte', 'möchten', 'möchtet', 'möchten'],
    praeteritum: 'wollte',
    participle: 'gewollt',
    auxiliary: 'haben',
    note: 'möchten has no past of its own: for the past, use wollen (ich wollte).',
  },
  // Irregular verbs outside the irregular-verbs table
  {
    infinitive: 'mitkommen',
    gloss: 'to come along',
    kind: 'irregular',
    present: ['komme mit', 'kommst mit', 'kommt mit', 'kommen mit', 'kommt mit', 'kommen mit'],
    praeteritum: 'kam mit',
    participle: 'mitgekommen',
    auxiliary: 'sein',
  },
  {
    infinitive: 'fernsehen',
    gloss: 'to watch TV',
    kind: 'irregular',
    present: ['sehe fern', 'siehst fern', 'sieht fern', 'sehen fern', 'seht fern', 'sehen fern'],
    praeteritum: 'sah fern',
    participle: 'ferngesehen',
    auxiliary: 'haben',
  },
  {
    infinitive: 'gefallen',
    gloss: 'to please (Das gefällt mir: I like that)',
    kind: 'irregular',
    present: ['gefalle', 'gefällst', 'gefällt', 'gefallen', 'gefallt', 'gefallen'],
    praeteritum: 'gefiel',
    participle: 'gefallen',
    auxiliary: 'haben',
    dative: true,
  },
  // Regular verbs
  regularVerb('machen', 'to make, to do'),
  regularVerb('arbeiten', 'to work'),
  regularVerb('wohnen', 'to live (somewhere)'),
  regularVerb('kaufen', 'to buy'),
  regularVerb('lernen', 'to learn'),
  regularVerb('spielen', 'to play'),
  regularVerb('kochen', 'to cook'),
  regularVerb('hören', 'to hear, to listen to'),
  regularVerb('sagen', 'to say'),
  regularVerb('fragen', 'to ask'),
  regularVerb('brauchen', 'to need'),
  regularVerb('suchen', 'to look for'),
  regularVerb('zeigen', 'to show'),
  regularVerb('warten', 'to wait'),
  regularVerb('reisen', 'to travel', { auxiliary: 'sein' }),
  regularVerb('tanzen', 'to dance'),
  regularVerb('besuchen', 'to visit'),
  regularVerb('bezahlen', 'to pay'),
  regularVerb('erklären', 'to explain'),
  regularVerb('studieren', 'to study (at university)'),
  regularVerb('telefonieren', 'to phone'),
  // Separable regular verbs
  regularVerb('einkaufen', 'to go shopping', { prefix: 'ein' }),
  regularVerb('aufräumen', 'to tidy up', { prefix: 'auf' }),
  regularVerb('aufhören', 'to stop', { prefix: 'auf' }),
  regularVerb('aufmachen', 'to open', { prefix: 'auf' }),
  regularVerb('zumachen', 'to close', { prefix: 'zu' }),
  regularVerb('abholen', 'to pick up', { prefix: 'ab' }),
  // Regular verbs that take the dative
  regularVerb('danken', 'to thank', { dative: true }),
  regularVerb('gehören', 'to belong to', { dative: true }),
  regularVerb('gratulieren', 'to congratulate', { dative: true }),
  regularVerb('schmecken', 'to taste (good)', { dative: true }),
  regularVerb('passen', 'to fit, to suit', { dative: true }),
  regularVerb('antworten', 'to answer', { dative: true }),
];
