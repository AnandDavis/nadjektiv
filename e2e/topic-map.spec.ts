import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the topic map shows every topic with its medal, and opens it', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }

  await page.goto('/progress');
  const map = page.getByRole('region', { name: 'Themenkarte' });
  await expect(map.getByRole('link')).toHaveCount(24);
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
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});
