import { expect, test } from '@playwright/test';

const headline = /Zeit ist um|Perfekt|Gut gemacht|Weiter üben/;

test('the results screen opens at the top after the Blitz clock runs out', async ({ page }) => {
  await page.clock.install();
  await page.goto('/play/noun-gender/sort');
  await page.getByRole('button', { name: /Los geht/ }).click();

  // Answer a few so the results have content, then scroll down as a learner might.
  const bins = page.getByRole('group', { name: 'Sort into' });
  for (let i = 0; i < 4; i++) {
    await bins.getByRole('button', { name: 'die' }).click();
    const next = page.getByRole('button', { name: 'Weiter' });
    if (await next.isVisible()) await next.click();
    await page.clock.runFor(300);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.clock.runFor(61_000);

  await expect(page.getByRole('heading', { level: 2, name: headline })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('the results screen opens at the top after a round with many mistakes', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  await expect(page.getByRole('heading', { level: 2, name: headline })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
