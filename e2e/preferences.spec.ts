import { expect, test } from '@playwright/test';

test('interface language switches headings to English and persists', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Was üben wir heute?' })).toBeVisible();

  await page.goto('/settings');
  await page.getByText('English', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'What shall we practise today?' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Learn', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What shall we practise today?' })).toBeVisible();

  // Grammar content stays German.
  await page.goto('/topics/noun-gender');
  await expect(page.getByRole('heading', { name: 'The rules' })).toBeVisible();
  await expect(page.getByText('die Wohnung, die Zeitung')).toBeVisible();
});
