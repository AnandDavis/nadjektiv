import { expect, test, type Page } from '@playwright/test';

/** Make the browser offer installation, as Chromium does with beforeinstallprompt. */
async function offerInstall(page: Page) {
  await page.evaluate(() => {
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt: () => Promise.resolve(),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    });
    window.dispatchEvent(event);
  });
}

test('Settings offers to install the app when the browser allows it', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('button', { name: 'Installieren' })).toHaveCount(0);
  await offerInstall(page);
  await expect(page.getByRole('button', { name: 'Installieren' })).toBeVisible();
  await expect(page.getByText(/Fortschritt/).first()).toBeVisible();
});

test('home shows a one-time install hint once the learner has played', async ({ page }) => {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
  await page.getByRole('link', { name: 'Start' }).click();
  await offerInstall(page);
  await expect(page.getByText('App installieren')).toBeVisible();
  await page.getByRole('button', { name: 'Schließen' }).click();
  await expect(page.getByText('App installieren')).toHaveCount(0);
  await page.reload();
  await offerInstall(page);
  await expect(page.getByText('App installieren')).toHaveCount(0);
});
