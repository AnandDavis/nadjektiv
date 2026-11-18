/**
 * Topic mastery tiers: new → bronze → silver → gold → mastered.
 *
 * Tiers come from *recent* accuracy, so they reflect what the learner knows now.
 * There is no decay for time away — only for getting things wrong.
 */

import type { GameMode, QuestionMode } from '@/content/types';

import { RECENT_WINDOW, type TopicProgress } from './types';
import type { Bilingual } from '../i18n/copy';

export const TIERS = ['new', 'bronze', 'silver', 'gold', 'mastered'] as const;
export type Tier = (typeof TIERS)[number];

interface TierRule {
  tier: Exclude<Tier, 'new'>;
  minAnswered: number;
  minAccuracy: number;
  needsAllModes: boolean;
}

export const TIER_RULES: readonly TierRule[] = [
  { tier: 'bronze', minAnswered: 10, minAccuracy: 0.6, needsAllModes: false },
  { tier: 'silver', minAnswered: 30, minAccuracy: 0.75, needsAllModes: false },
  { tier: 'gold', minAnswered: 60, minAccuracy: 0.85, needsAllModes: true },
  { tier: 'mastered', minAnswered: 100, minAccuracy: 0.92, needsAllModes: true },
];

export const TIER_LABELS: Record<Tier, Bilingual> = {
  new: { de: 'Neu', en: 'Not started' },
  bronze: { de: 'Bronze', en: 'Bronze' },
  silver: { de: 'Silber', en: 'Silver' },
  gold: { de: 'Gold', en: 'Gold' },
  mastered: { de: 'Gemeistert', en: 'Mastered' },
};

export interface Requirement {
  label: Bilingual;
  isMet: boolean;
}

export interface MasteryInfo {
  tier: Tier;
  /** Accuracy over the recent window, 0–1; 0 when nothing answered. */
  recentAccuracy: number;
  next?: { tier: Tier; requirements: Requirement[] };
}

export function recentAccuracy(progress: TopicProgress | undefined): number {
  if (!progress || progress.recent.length === 0) return 0;
  return progress.recent.reduce<number>((sum, r) => sum + r, 0) / progress.recent.length;
}

const MODE_NAMES: Record<QuestionMode, string> = {
  sort: 'Blitz',
  gap: 'Lückentext',
  build: 'Satzbau',
  type: 'Tippen',
};

/**
 * Modes that count towards "play every mode". Grid fill and Type the answer are
 * bonuses: grid fill arrived after learners had earned medals, and Type the answer
 * only unlocks once a topic has one. Requiring either would take medals away.
 */
function requiredModes(modes: readonly GameMode[]): QuestionMode[] {
  return modes.filter((mode): mode is QuestionMode => mode !== 'grid' && mode !== 'type');
}

function requirementsFor(
  rule: TierRule,
  progress: TopicProgress | undefined,
  modes: readonly GameMode[],
): Requirement[] {
  const answered = progress?.answered ?? 0;
  const acc = recentAccuracy(progress);
  const requirements: Requirement[] = [
    {
      label: {
        de: `${rule.minAnswered} Fragen beantworten (bisher ${answered})`,
        en: `Answer ${rule.minAnswered} questions (${answered} so far)`,
      },
      isMet: answered >= rule.minAnswered,
    },
    {
      label: {
        // German puts a (no-break) space before %.
        de: `${Math.round(rule.minAccuracy * 100)}\u00a0% richtig bei deinen letzten ${RECENT_WINDOW} Antworten (jetzt ${Math.round(acc * 100)}\u00a0%)`,
        en: `${Math.round(rule.minAccuracy * 100)}% correct over your last ${RECENT_WINDOW} answers (now ${Math.round(acc * 100)}%)`,
      },
      isMet: answered > 0 && acc >= rule.minAccuracy,
    },
  ];
  const required = requiredModes(modes);
  if (rule.needsAllModes && required.length > 1) {
    for (const mode of required) {
      requirements.push({
        label: { de: `${MODE_NAMES[mode]} spielen`, en: `Play ${MODE_NAMES[mode]}` },
        // Blitz counts as played with or without the clock.
        isMet: Boolean(progress?.modes[mode] ?? (mode === 'sort' && progress?.modes.sortUntimed)),
      });
    }
  }
  return requirements;
}

export function masteryFor(
  progress: TopicProgress | undefined,
  modes: readonly GameMode[],
): MasteryInfo {
  let tier: Tier = 'new';
  let next: MasteryInfo['next'];
  for (const rule of TIER_RULES) {
    const requirements = requirementsFor(rule, progress, modes);
    if (requirements.every((r) => r.isMet)) {
      tier = rule.tier;
    } else {
      next = { tier: rule.tier, requirements };
      break;
    }
  }
  return { tier, recentAccuracy: recentAccuracy(progress), next };
}

export function tierRank(tier: Tier): number {
  return TIERS.indexOf(tier);
}
