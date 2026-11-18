import { expect, test } from '@playwright/test';

/**
 * No page may be wider than the phone. A single long German compound in a big heading
 * (Wechselpräpositionen, Die 33 unregelmäßigen Verben) once widened the page, which
 * makes the browser zoom out and pushes the bottom navigation off screen.
 */
const PAGES = [
  '/',
  '/topics/two-way-prepositions',
  '/topics/irregular-verbs',
  '/topics/sentence-middle',
  '/play/two-way-prepositions/sort',
  '/play/irregular-verbs/gap',
  '/revise',
  '/progress',
  '/settings',
  '/about',
];

for (const language of ['de', 'en'] as const) {
  for (const path of PAGES) {
    test(`${path} fits the screen width (${language})`, async ({ page }) => {
      if (language === 'en') {
        await page.addInitScript(() => window.localStorage.setItem('grammatik:ui-language', 'en'));
      }
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(
        scrollWidth,
        `page is ${scrollWidth}px wide on a ${innerWidth}px screen`,
      ).toBeLessThanOrEqual(innerWidth);
    });
  }
}
