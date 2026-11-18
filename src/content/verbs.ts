/**
 * Present-tense forms for the irregular verbs in irregular-verbs.ts, for the verb
 * lookup. The er-form, Präteritum and Partizip II come from that topic's table; a test
 * checks that the er-forms here agree with it. Check every form against docs/grammar/.
 */

/** ich, du, er/sie/es, wir, ihr, sie/Sie. */
export type PresentForms = readonly [string, string, string, string, string, string];

export interface VerbForms {
  /** English, as "to go". */
  gloss: string;
  present: PresentForms;
}

export const PRESENT_PERSONS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'] as const;

export const VERB_FORMS: Readonly<Record<string, VerbForms>> = {
  sein: { gloss: 'to be', present: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'] },
  haben: { gloss: 'to have', present: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'] },
  werden: {
    gloss: 'to become',
    present: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'],
  },
  gehen: { gloss: 'to go, to walk', present: ['gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'] },
  kommen: {
    gloss: 'to come',
    present: ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'],
  },
  fahren: {
    gloss: 'to drive, to travel',
    present: ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'],
  },
  bleiben: {
    gloss: 'to stay',
    present: ['bleibe', 'bleibst', 'bleibt', 'bleiben', 'bleibt', 'bleiben'],
  },
  laufen: {
    gloss: 'to run, to walk',
    present: ['laufe', 'läufst', 'läuft', 'laufen', 'lauft', 'laufen'],
  },
  fliegen: {
    gloss: 'to fly',
    present: ['fliege', 'fliegst', 'fliegt', 'fliegen', 'fliegt', 'fliegen'],
  },
  aufstehen: {
    gloss: 'to get up',
    present: ['stehe auf', 'stehst auf', 'steht auf', 'stehen auf', 'steht auf', 'stehen auf'],
  },
  sehen: { gloss: 'to see', present: ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'] },
  geben: { gloss: 'to give', present: ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben'] },
  nehmen: {
    gloss: 'to take',
    present: ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen'],
  },
  essen: { gloss: 'to eat', present: ['esse', 'isst', 'isst', 'essen', 'esst', 'essen'] },
  trinken: {
    gloss: 'to drink',
    present: ['trinke', 'trinkst', 'trinkt', 'trinken', 'trinkt', 'trinken'],
  },
  sprechen: {
    gloss: 'to speak',
    present: ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'],
  },
  lesen: { gloss: 'to read', present: ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'] },
  schreiben: {
    gloss: 'to write',
    present: ['schreibe', 'schreibst', 'schreibt', 'schreiben', 'schreibt', 'schreiben'],
  },
  finden: {
    gloss: 'to find',
    present: ['finde', 'findest', 'findet', 'finden', 'findet', 'finden'],
  },
  helfen: { gloss: 'to help', present: ['helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'helfen'] },
  treffen: {
    gloss: 'to meet',
    present: ['treffe', 'triffst', 'trifft', 'treffen', 'trefft', 'treffen'],
  },
  schlafen: {
    gloss: 'to sleep',
    present: ['schlafe', 'schläfst', 'schläft', 'schlafen', 'schlaft', 'schlafen'],
  },
  wissen: {
    gloss: 'to know (a fact)',
    present: ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'],
  },
  denken: {
    gloss: 'to think',
    present: ['denke', 'denkst', 'denkt', 'denken', 'denkt', 'denken'],
  },
  kennen: {
    gloss: 'to know (a person or place)',
    present: ['kenne', 'kennst', 'kennt', 'kennen', 'kennt', 'kennen'],
  },
  bringen: {
    gloss: 'to bring',
    present: ['bringe', 'bringst', 'bringt', 'bringen', 'bringt', 'bringen'],
  },
  beginnen: {
    gloss: 'to begin',
    present: ['beginne', 'beginnst', 'beginnt', 'beginnen', 'beginnt', 'beginnen'],
  },
  verstehen: {
    gloss: 'to understand',
    present: ['verstehe', 'verstehst', 'versteht', 'verstehen', 'versteht', 'verstehen'],
  },
  bekommen: {
    gloss: 'to get, to receive',
    present: ['bekomme', 'bekommst', 'bekommt', 'bekommen', 'bekommt', 'bekommen'],
  },
  vergessen: {
    gloss: 'to forget',
    present: ['vergesse', 'vergisst', 'vergisst', 'vergessen', 'vergesst', 'vergessen'],
  },
  anfangen: {
    gloss: 'to start',
    present: ['fange an', 'fängst an', 'fängt an', 'fangen an', 'fangt an', 'fangen an'],
  },
  anrufen: {
    gloss: 'to phone',
    present: ['rufe an', 'rufst an', 'ruft an', 'rufen an', 'ruft an', 'rufen an'],
  },
  einladen: {
    gloss: 'to invite',
    present: ['lade ein', 'lädst ein', 'lädt ein', 'laden ein', 'ladet ein', 'laden ein'],
  },
};
