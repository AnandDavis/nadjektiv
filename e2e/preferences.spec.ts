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

test('game and results labels follow the interface language', async ({ page }) => {
  await page.goto('/settings');
  await page.getByText('English', { exact: true }).click();

  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Let’s go/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();
  }
  await expect(page.getByText(/of 10 correct/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();

  await page.goto('/topics/articles');
  await expect(page.getByText(/^Answer \d+ questions \(10 so far\)$/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'All topics' })).toBeVisible();
});
