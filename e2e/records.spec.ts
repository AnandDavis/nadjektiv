import { expect, test } from '@playwright/test';

test('records are empty at first, then show each round’s bests', async ({ page }) => {
  await page.goto('/records');
  await expect(page.getByText(/Noch keine Rekorde/)).toBeVisible();

  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }

  await page.goto('/progress');
  await page.getByRole('link', { name: 'Rekorde ansehen' }).click();
  await expect(page).toHaveURL(/\/records$/);
  const topics = page.getByRole('region', { name: 'Themen' });
  await expect(topics.getByText('Die Artikeltabelle')).toBeVisible();
  await expect(topics.getByText('Lückentext')).toBeVisible();
});
