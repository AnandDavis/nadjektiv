import { expect, test } from '@playwright/test';

test('a Lückentext round can be played with the keyboard alone', async ({ page }) => {
  await page.goto('/play/articles/gap');
  // Start is enabled once saved progress has loaded.
  await expect(page.getByRole('button', { name: /Los geht/ })).toBeEnabled();
  await page.keyboard.press('Enter');
  const options = page.getByRole('group', { name: 'Answer options' });
  await expect(options).toBeVisible();

  await page.keyboard.press('h');
  await expect(page.getByText('Hinweis', { exact: true })).toBeVisible();

  await page.keyboard.press('2');
  await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/^02\s*\/\s*10$/)).toBeVisible();

  await page.keyboard.press('b');
  await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
});

test('Backspace takes back the last word in Satzbau', async ({ page }) => {
  await page.goto('/play/word-order/build');
  await page.getByRole('button', { name: /Los geht/ }).click();
  const pool = page.getByRole('group', { name: 'Words to place' }).getByRole('button');
  const before = await pool.count();
  await pool.first().click();
  await pool.first().click();
  await expect(pool).toHaveCount(before - 2);
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('Backspace');
  await expect(pool).toHaveCount(before - 1);
});

test('shortcuts leave Tippen’s answer field alone', async ({ page }) => {
  await page.goto('/play/articles/type');
  await page.getByRole('button', { name: /Los geht/ }).click();
  const field = page.getByRole('textbox', { name: 'Deine Antwort' });
  await field.pressSequentially('dh1');
  // A gap that starts the sentence capitalises the first letter as it's typed.
  await expect(field).toHaveValue(/^[dD]h1$/);
  await expect(page.getByText('Hinweis', { exact: true })).toHaveCount(0);
});
