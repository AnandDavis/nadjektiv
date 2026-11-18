import { expect, test } from '@playwright/test';

test('a noun met for the first time is shown before it is asked, once', async ({ page }) => {
  await page.clock.install();
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();

  const card = page.getByRole('region', { name: 'Neues Wort' });
  await expect(card).toBeVisible();
  const word = (await card.locator('p.text-4xl').textContent())!.trim();
  // The clock waits while the card is up.
  await page.clock.runFor(5_000);
  await expect(page.getByText('60s')).toBeVisible();

  await page.getByRole('button', { name: 'Verstanden' }).click();
  await expect(page.getByRole('group', { name: 'Sort into' })).toBeVisible();
  const seen = await page.evaluate(
    () => JSON.parse(localStorage.getItem('grammatik:progress')!).seenNouns,
  );
  expect(seen).toEqual([word.split(' ')[1]]);
});

test('noun cards ask for the article and plural together', async ({ page }) => {
  await page.goto('/play/noun-cards/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await page.getByRole('button', { name: 'Verstanden' }).click();
  const options = page.getByRole('group', { name: 'Answer options' }).getByRole('button');
  await expect(options).toHaveCount(4);
  await expect(options.first()).toContainText(', die ');
});
