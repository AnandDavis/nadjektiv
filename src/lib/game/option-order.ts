/**
 * The order answer options appear in. Options are shuffled so the answer's place gives
 * nothing away, except article choices: those always read der, die, das (then den, dem,
 * des), so learners find each article in the same place every time.
 */

import { shuffle, type Rng } from './rng';

const ARTICLE_ORDER = ['der', 'die', 'das', 'den', 'dem', 'des'];

/** An option's article rank, from its first word ("der Tisch, die Tische" → der). */
function articleRank(option: string): number {
  return ARTICLE_ORDER.indexOf(option.trim().split(/\s+/)[0].toLowerCase());
}

/**
 * Shuffle the options; when every option starts with a definite article, sort them by
 * article. Options sharing an article keep their shuffled order.
 */
export function orderOptions(options: readonly string[], rng: Rng): string[] {
  const shuffled = shuffle(options, rng);
  if (!options.every((option) => articleRank(option) >= 0)) return shuffled;
  return shuffled.sort((a, b) => articleRank(a) - articleRank(b));
}
