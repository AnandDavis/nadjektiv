import { expect, test } from '@playwright/test';

test('the verb lookup finds a verb by any of its forms', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitem', { name: 'Verben' }).click();
  await expect(page).toHaveURL(/\/verbs$/);

  await page.getByRole('searchbox', { name: 'Verb suchen' }).fill('ging');
  const verbs = page.getByRole('article');
  await expect(verbs).toHaveCount(1);
  await expect(verbs.getByRole('heading', { name: 'gehen' })).toBeVisible();
  await expect(verbs).toContainText('er ist gegangen');

  await verbs.getByRole('link', { name: 'Perfekt' }).click();
  await expect(page).toHaveURL(/\/topics\/perfekt$/);
  await expect(page.getByRole('link', { name: /Verben/ })).toBeVisible();
});
