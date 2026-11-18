import type { Page } from '@playwright/test';

import { NOUNS } from '../src/content/nouns';

/**
 * Start with every noun already met, so no "new word" card interrupts specs about
 * something else (the card has its own spec). Only seeds an empty store, so progress
 * a spec builds up survives reloads.
 */
export async function skipNewWords(page: Page) {
  await page.addInitScript(
    (words) => {
      const key = 'grammatik:progress';
      if (localStorage.getItem(key)) return;
      const progress = { version: 3, xp: 0, topics: {}, questions: {}, revise: {}, grids: {} };
      localStorage.setItem(key, JSON.stringify({ ...progress, seenNouns: words }));
    },
    [...NOUNS.keys()],
  );
}
