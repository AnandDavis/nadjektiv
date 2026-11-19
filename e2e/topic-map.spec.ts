import AxeBuilder from '@axe-core/playwright';
import { TOPICS } from '../src/content';
import { expect, test } from '@playwright/test';

import { settleMotion } from './motion';

test('the topic map shows every topic with its medal, and opens it', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }

  await page.goto('/progress');
  const map = page.getByRole('region', { name: 'Themenkarte' });
  await expect(map.getByRole('link')).toHaveCount(TOPICS.length);
  // Each square says which topic and which medal, not just a colour.
  const articles = map.getByRole('link', { name: /^\d{2} Die Artikeltabelle: / });
  await expect(articles).toBeVisible();
  await expect(map.getByRole('link', { name: '01 der, die oder das?: Neu' })).toBeVisible();

  await articles.click();
  await expect(page).toHaveURL(/\/topics\/articles$/);
});

test('the progress page, with its topic map, has no accessibility violations', async ({ page }) => {
  await page.goto('/progress');
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  await expect(page.getByRole('region', { name: 'Themenkarte' })).toBeVisible();
  await settleMotion(page);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('a topic opened from the progress page goes back to it, even after a round', async ({
  page,
}) => {
  await page.goto('/progress');
  await page.getByRole('region', { name: 'Themenkarte' }).getByRole('link').first().click();
  await expect(page).toHaveURL(/\/topics\/noun-gender$/);
  const back = page.getByRole('link', { name: 'Fortschritt', exact: true }).first();
  await expect(back).toBeVisible();

  // Play a round and come back to the topic: the way back is still Progress.
  await page.getByRole('link', { name: /Lückentext/ }).click();
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  await page.getByRole('link', { name: 'Thema' }).click();
  await back.click();
  await expect(page).toHaveURL(/\/progress$/);

  // From the topic list, it's "Alle Themen" and home.
  await page.goto('/');
  await page.getByRole('link', { name: /der, die oder das\?/ }).click();
  await page.getByRole('link', { name: 'Alle Themen' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('a topic opened from the glossary goes back to the glossary', async ({ page }) => {
  await page.goto('/glossary');
  await page.locator('#dativ').getByRole('link').first().click();
  await page.getByRole('link', { name: 'Glossar', exact: true }).first().click();
  await expect(page).toHaveURL(/\/glossary$/);
});
