/**
 * Lightweight topic metadata for lists. Computed on the server so client
 * components don't bundle every question bank.
 */

import { availableModes } from '@/lib/game/session';

import { TOPICS } from './index';
import type { Bilingual } from '@/lib/i18n/copy';

import type { GameMode, Level, TopicGroup } from './types';

export interface TopicSummary {
  id: string;
  level: Level;
  group: TopicGroup;
  title: string;
  titleDe: string;
  tagline: string;
  keywords: string[];
  modes: GameMode[];
  questionCount: number;
}

export function getTopicSummaries(): TopicSummary[] {
  return TOPICS.map((topic) => ({
    id: topic.id,
    level: topic.level,
    group: topic.group,
    title: topic.title,
    titleDe: topic.titleDe,
    keywords: topic.keywords,
    tagline: topic.tagline,
    modes: availableModes(topic),
    questionCount:
      (topic.sort?.questions.length ?? 0) + (topic.gap?.length ?? 0) + (topic.build?.length ?? 0),
  }));
}

export function modesByTopic(summaries: readonly TopicSummary[]): Record<string, GameMode[]> {
  return Object.fromEntries(summaries.map((s) => [s.id, s.modes]));
}

export function topicTitles(summaries: readonly TopicSummary[]): Record<string, Bilingual> {
  return Object.fromEntries(summaries.map((s) => [s.id, { de: s.titleDe, en: s.title }]));
}
