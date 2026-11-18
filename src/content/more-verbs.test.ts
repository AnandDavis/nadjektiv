import { describe, expect, it } from 'vitest';

import { MORE_VERBS, regularVerb } from './more-verbs';
import { VERB_FORMS } from './verbs';

const forms = (infinitive: string) => {
  const verb = MORE_VERBS.find((v) => v.infinitive === infinitive)!;
  return [...verb.present, verb.praeteritum, verb.participle, verb.auxiliary];
};

describe('regular verb forms', () => {
  it('builds the plain pattern', () => {
    expect(forms('machen')).toEqual([
      'mache',
      'machst',
      'macht',
      'machen',
      'macht',
      'machen',
      'machte',
      'gemacht',
      'haben',
    ]);
  });

  it('adds -e- after -t, -d and consonant + n', () => {
    expect(forms('arbeiten')).toEqual([
      'arbeite',
      'arbeitest',
      'arbeitet',
      'arbeiten',
      'arbeitet',
      'arbeiten',
      'arbeitete',
      'gearbeitet',
      'haben',
    ]);
    expect(forms('antworten').slice(6, 8)).toEqual(['antwortete', 'geantwortet']);
    expect(regularVerb('öffnen', 'to open').present[1]).toBe('öffnest');
    expect(forms('wohnen')[1]).toBe('wohnst');
    expect(forms('lernen')[1]).toBe('lernst');
  });

  it('gives du only -t after s, ß, x or z', () => {
    expect(forms('tanzen')[1]).toBe('tanzt');
    expect(forms('reisen')).toEqual([
      'reise',
      'reist',
      'reist',
      'reisen',
      'reist',
      'reisen',
      'reiste',
      'gereist',
      'sein',
    ]);
    expect(forms('passen')[1]).toBe('passt');
  });

  it('leaves out ge- after an inseparable prefix and in -ieren verbs', () => {
    expect(forms('besuchen')[7]).toBe('besucht');
    expect(forms('bezahlen')[7]).toBe('bezahlt');
    expect(forms('erklären')[7]).toBe('erklärt');
    expect(forms('gehören')[7]).toBe('gehört');
    expect(forms('studieren').slice(1, 3)).toEqual(['studierst', 'studiert']);
    expect(forms('studieren')[7]).toBe('studiert');
    expect(forms('gratulieren')[7]).toBe('gratuliert');
  });

  it('sends a separable prefix to the end, and puts it before ge-', () => {
    expect(forms('einkaufen')).toEqual([
      'kaufe ein',
      'kaufst ein',
      'kauft ein',
      'kaufen ein',
      'kauft ein',
      'kaufen ein',
      'kaufte ein',
      'eingekauft',
      'haben',
    ]);
    expect(forms('aufräumen')[7]).toBe('aufgeräumt');
    expect(forms('zumachen')[2]).toBe('macht zu');
    expect(forms('abholen')[7]).toBe('abgeholt');
  });
});

describe('verb list', () => {
  it('lists each verb once and none twice with the irregular table', () => {
    const names = MORE_VERBS.map((v) => v.infinitive);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
    expect(names.filter((n) => VERB_FORMS[n])).toEqual([]);
  });
});
