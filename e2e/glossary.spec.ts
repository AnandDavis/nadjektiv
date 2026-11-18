import { expect, test } from '@playwright/test';

test('the glossary explains a term, links its topics, and is in the menu', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitem', { name: 'Glossar' }).click();
  await expect(page).toHaveURL(/\/glossary$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Glossar' })).toBeVisible();

  const dativ = page.locator('#dativ');
  await expect(dativ).toContainText('Ich helfe meiner Mutter.');
  await dativ.getByRole('link', { name: 'Dativverben und zwei Objekte' }).click();
  await expect(page).toHaveURL(/\/topics\/dative-verbs$/);
});

test('a link to a term lands on it', async ({ page }) => {
  await page.goto('/glossary#wechselpraeposition');
  await expect(page.locator('#wechselpraeposition')).toBeInViewport();
});
