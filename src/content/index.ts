/**
 * Registry of all grammar topics, in learning order.
 */

import { adjectiveEndings } from './topics/adjective-endings';
import { articles } from './topics/articles';
import { cases } from './topics/cases';
import { comparatives } from './topics/comparatives';
import { connectors } from './topics/connectors';
import { dativeVerbs } from './topics/dative-verbs';
import { imperative } from './topics/imperative';
import { irregularVerbs } from './topics/irregular-verbs';
import { modalVerbs } from './topics/modal-verbs';
import { negation } from './topics/negation';
import { nounCards } from './topics/noun-cards';
import { nounGender } from './topics/noun-gender';
import { perfekt } from './topics/perfekt';
import { plurals } from './topics/plurals';
import { praeteritum } from './topics/praeteritum';
import { prepositionsPlaceTime } from './topics/prepositions-place-time';
import { presentTense } from './topics/present-tense';
import { pronouns } from './topics/pronouns';
import { reflexiveVerbs } from './topics/reflexive-verbs';
import { sentenceMiddle } from './topics/sentence-middle';
import { separableVerbs } from './topics/separable-verbs';
import { tellingTime } from './topics/telling-time';
import { twoWayPrepositions } from './topics/two-way-prepositions';
import { weakNouns } from './topics/weak-nouns';
import { wordOrder } from './topics/word-order';
import { zuInfinitive } from './topics/zu-infinitive';
import type { GameMode, Level, Topic } from './types';

export const TOPICS: readonly Topic[] = [
  // A1
  nounGender,
  plurals,
  nounCards,
  articles,
  cases,
  pronouns,
  presentTense,
  wordOrder,
  negation,
  modalVerbs,
  separableVerbs,
  perfekt,
  imperative,
  prepositionsPlaceTime,
  tellingTime,
  // A2
  weakNouns,
  adjectiveEndings,
  dativeVerbs,
  twoWayPrepositions,
  comparatives,
  praeteritum,
  irregularVerbs,
  reflexiveVerbs,
  connectors,
  zuInfinitive,
  sentenceMiddle,
];

const TOPICS_BY_ID = new Map(TOPICS.map((topic) => [topic.id, topic]));

export function getTopic(id: string): Topic | undefined {
  return TOPICS_BY_ID.get(id);
}

export const LEVELS: readonly Level[] = ['A1', 'A2'];

export const GAME_MODES: readonly GameMode[] = ['sort', 'gap', 'build', 'type', 'grid'];

export function isGameMode(value: string): value is GameMode {
  return (GAME_MODES as readonly string[]).includes(value);
}
