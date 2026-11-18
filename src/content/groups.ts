import type { Bilingual } from '@/lib/i18n/copy';

import type { TopicGroup } from './types';

export const GROUP_LABELS: Record<TopicGroup, Bilingual> = {
  nouns: { de: 'Nomen', en: 'Nouns' },
  cases: { de: 'Fälle und Pronomen', en: 'Cases and pronouns' },
  verbs: { de: 'Verben', en: 'Verbs' },
  sentences: { de: 'Sätze bauen', en: 'Sentence building' },
  prepositions: { de: 'Präpositionen und Zeit', en: 'Prepositions and time' },
  adjectives: { de: 'Adjektive', en: 'Adjectives' },
};
