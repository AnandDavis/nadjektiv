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
  '/play/irregular-verbs/grid',
  '/play/present-tense/grid',
  '/revise',
  '/progress',
  '/settings',
  '/about',
  '/glossary',
  '/verbs',
  '/records',
];

// German and English labels, and German at the largest text size (an option in Settings).
const VARIANTS = [
  { language: 'de', size: 'normal' },
  { language: 'en', size: 'normal' },
  { language: 'de', size: 'larger' },
] as const;

for (const { language, size } of VARIANTS) {
  for (const path of PAGES) {
    test(`${path} fits the screen width (${language}, ${size} text)`, async ({ page }) => {
      if (language === 'en') {
        await page.addInitScript(() => window.localStorage.setItem('grammatik:ui-language', 'en'));
      }
      if (size === 'larger') {
        await page.addInitScript(() =>
          window.localStorage.setItem('grammatik:text-size', 'larger'),
        );
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
