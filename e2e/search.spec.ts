import AxeBuilder from '@axe-core/playwright';
import { TOPICS } from '../src/content';
import { expect, test, type Page } from '@playwright/test';

const topicLinks = (page: Page) => page.getByRole('main').getByRole('link', { name: /^\d{2} / });

test('search filters the topic index in place', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Themen suchen' });
  const total = await topicLinks(page).count();
  expect(total).toBe(TOPICS.length);

  await search.fill('wechsel');
  await expect(topicLinks(page)).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Wechselpräpositionen/ })).toBeVisible();
  await expect(page.getByText('1 Thema')).toBeVisible();
  // The A1 section has no match, so it disappears; topics keep their index number.
  await expect(page.getByRole('heading', { name: 'A1', exact: true })).toHaveCount(0);
  const index = String(TOPICS.findIndex((t) => t.id === 'two-way-prepositions') + 1);
  await expect(page.getByRole('link', { name: new RegExp(`^${index} `) })).toBeVisible();

  await search.fill('prateritum');
  await expect(page.getByRole('link', { name: /Präteritum/ }).first()).toBeVisible();

  await search.press('Escape');
  await expect(topicLinks(page)).toHaveCount(total);
});

test('search shows an empty state that clears back to every topic', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Themen suchen' }).fill('xylophon');
  await expect(page.getByText('Kein Thema gefunden')).toBeVisible();
  await expect(topicLinks(page)).toHaveCount(0);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);

  await page.getByRole('button', { name: 'Alle Themen zeigen' }).click();
  await expect(topicLinks(page)).toHaveCount(TOPICS.length);
});

test('"See the rules" opens the topic at its rules, below the header', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  await page.goto('/revise');
  await page
    .getByRole('link', { name: /Regeln ansehen/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/topics\/articles#rules-heading$/);
  const rulesHeading = page.getByRole('heading', { level: 2, name: 'Die Regeln' });
  await expect(rulesHeading).toBeInViewport();
  const headerBottom = await page
    .getByRole('banner')
    .evaluate((el) => el.getBoundingClientRect().bottom);
  await expect
    .poll(() => rulesHeading.evaluate((el) => el.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(headerBottom);
});

test('opening a topic from a search clears the search for when you come back', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Themen suchen' });
  await search.fill('wechsel');
  await page.getByRole('link', { name: /Wechselpräpositionen/ }).click();
  await expect(page).toHaveURL(/\/topics\//);
  await page.goBack();
  await expect(search).toHaveValue('');
  await expect(topicLinks(page)).toHaveCount(TOPICS.length);
});
