import { expect, test } from '@playwright/test';

test('interface language switches headings to English and persists', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Was üben wir heute?' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Wechselpräpositionen/ })).toBeVisible();

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
  await expect(page.getByRole('heading', { level: 1, name: 'The article grid' })).toBeVisible();
});

test('the browser bar matches the app header, following the in-app theme', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  // Browsers colour their bar from the first theme-color whose media matches.
  const barColour = () =>
    page.evaluate(() => {
      const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
      return metas.find((m) => !m.media || matchMedia(m.media).matches)?.content;
    });
  const headerColour = () =>
    page.evaluate(() => {
      const header = document.querySelector('header')!;
      const [r, g, b] = getComputedStyle(header).backgroundColor.match(/\d+/g)!.map(Number);
      return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
    });

  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/settings');
  expect(await barColour()).toBe(await headerColour());
  expect(await headerColour()).toBe('#151515');

  await page.getByText('Dunkel', { exact: true }).filter({ visible: true }).click();
  expect(await barColour()).toBe(await headerColour());
  expect(await headerColour()).toBe('#efebe0');

  // Applied before paint on the next visit, with nothing for React to complain about.
  await page.reload();
  expect(await barColour()).toBe('#efebe0');
  await page.getByText('System', { exact: true }).filter({ visible: true }).click();
  expect(await barColour()).toBe(await headerColour());
  expect(await headerColour()).toBe('#151515');
  expect(errors).toEqual([]);
});
