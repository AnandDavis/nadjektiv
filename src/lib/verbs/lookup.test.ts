import { describe, expect, it } from 'vitest';

import { getTopic } from '@/content';
import { VERB_FORMS } from '@/content/verbs';

import { searchVerbs, verbEntries } from './lookup';

const entries = verbEntries();

describe('verbEntries', () => {
  it('covers every verb in the irregular-verbs table, with matching er-forms', () => {
    const rows = getTopic('irregular-verbs')!.rules[0].table!.rows;
    const names = entries.map((e) => e.infinitive);
    expect(rows.map((r) => r[0]).filter((name) => !names.includes(name))).toEqual([]);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'de')));
    expect(Object.keys(VERB_FORMS).sort()).toEqual(rows.map((r) => r[0]).sort());
    for (const [infinitive, er] of rows) {
      expect(VERB_FORMS[infinitive].present[2], infinitive).toBe(er);
    }
  });

  it('keeps wir and sie/Sie the infinitive (split for separable verbs), except sein', () => {
    for (const e of entries.filter((entry) => entry.infinitive !== 'sein')) {
      const infinitive = e.separable ? e.present[3].split(' ').reverse().join('') : e.present[3];
      expect(infinitive, e.infinitive).toBe(e.infinitive);
      expect(e.present[5]).toBe(e.present[3]);
    }
  });

  it('reads the Perfekt auxiliary from the participle column', () => {
    const gehen = entries.find((e) => e.infinitive === 'gehen')!;
    expect(gehen).toMatchObject({ auxiliary: 'sein', participle: 'gegangen', praeteritum: 'ging' });
    const sehen = entries.find((e) => e.infinitive === 'sehen')!;
    expect(sehen).toMatchObject({ auxiliary: 'haben', participle: 'gesehen' });
    expect(entries.find((e) => e.infinitive === 'anfangen')!.topicIds).toContain('separable-verbs');
  });

  it('marks modal and dative verbs and links their topics', () => {
    const koennen = entries.find((e) => e.infinitive === 'können')!;
    expect(koennen).toMatchObject({
      kind: 'modal',
      present: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'],
    });
    expect(koennen.topicIds).toContain('modal-verbs');
    expect(koennen.topicIds).not.toContain('irregular-verbs');
    for (const name of ['helfen', 'gefallen', 'danken']) {
      const verb = entries.find((e) => e.infinitive === name)!;
      expect(verb.dative, name).toBe(true);
      expect(verb.topicIds, name).toContain('dative-verbs');
    }
    expect(entries.find((e) => e.infinitive === 'einkaufen')!.separable).toBe(true);
  });
});

describe('searchVerbs', () => {
  it('finds verbs by name, English or any form', () => {
    expect(searchVerbs(entries, '')).toHaveLength(entries.length);
    expect(searchVerbs(entries, 'ging').map((e) => e.infinitive)).toEqual(['gehen']);
    expect(searchVerbs(entries, 'Fährst').map((e) => e.infinitive)).toEqual(['fahren']);
    expect(searchVerbs(entries, 'auf').map((e) => e.infinitive)).toEqual(
      expect.arrayContaining(['laufen', 'aufstehen', 'aufräumen']),
    );
    expect(searchVerbs(entries, 'kann').map((e) => e.infinitive)).toEqual(['können']);
    expect(searchVerbs(entries, 'to invite').map((e) => e.infinitive)).toEqual(['einladen']);
    expect(searchVerbs(entries, 'xyz')).toEqual([]);
  });
});
