import { expect, test, type Page } from '@playwright/test';

/** Press keys on the app's own keyboard. */
async function tap(page: Page, keys: string[]) {
  const keyboard = page.getByRole('group', { name: 'Tastatur' });
  for (const key of keys) await keyboard.getByRole('button', { name: key, exact: true }).click();
}

test.describe('on a touch screen', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'mobile', 'Touch screens only.');
  });

  test('Tippen types with the app keyboard and never opens the phone’s', async ({ page }) => {
    await page.goto('/play/articles/type');
    await page.getByRole('button', { name: /Los geht/ }).click();
    const field = page.getByRole('textbox', { name: 'Deine Antwort' });
    await expect(field).toHaveAttribute('inputmode', 'none');

    await tap(page, ['g', 'r', 'ö', 'ß', 'e', 'x', 'Löschen']);
    // A gap that opens a sentence shows the first letter as a capital.
    await expect(field).toHaveValue(/^[gG]röße$/);
    await tap(page, ['Leerzeichen', 'a']);
    await expect(field).toHaveValue(/^[gG]röße a$/);
    await page
      .getByRole('group', { name: 'Tastatur' })
      .getByRole('button', { name: 'Prüfen' })
      .click();
    await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
  });

  test('Tippen keeps the hint above the keys, and the field clears in one tap', async ({
    page,
  }) => {
    await page.goto('/play/articles/type');
    await page.getByRole('button', { name: /Los geht/ }).click();
    const hint = await page.getByRole('button', { name: /Hinweis zeigen/ }).boundingBox();
    const keys = await page.getByRole('group', { name: 'Tastatur' }).boundingBox();
    expect(hint!.y + hint!.height).toBeLessThanOrEqual(keys!.y);

    const field = page.getByRole('textbox', { name: 'Deine Antwort' });
    await tap(page, ['d', 'e']);
    await page.getByRole('button', { name: 'Antwort löschen' }).click();
    await expect(field).toHaveValue('');
    await expect(field).toBeFocused();
    await expect(page.getByRole('button', { name: 'Antwort löschen' })).toHaveCount(0);
  });

  test('Tabelle fills a cell with the app keyboard', async ({ page }) => {
    await page.goto('/play/articles/grid');
    await page.getByRole('button', { name: /Der bestimmte Artikel/ }).click();
    const cell = page.getByRole('textbox', { name: 'Akk M' });
    await cell.click();
    await expect(cell).toHaveAttribute('inputmode', 'none');
    await tap(page, ['d', 'e', 'n']);
    // A right answer locks the cell.
    await expect(page.getByRole('textbox', { name: 'Akk M' })).toHaveCount(0);
  });

  test('Settings can switch back to the phone’s keyboard', async ({ page }) => {
    await page.goto('/settings');
    await page.getByText('Geräte-Tastatur', { exact: true }).filter({ visible: true }).click();
    await page.goto('/play/articles/type');
    await page.getByRole('button', { name: /Los geht/ }).click();
    await expect(page.getByRole('group', { name: 'Tastatur' })).toHaveCount(0);
    await expect(page.getByRole('textbox', { name: 'Deine Antwort' })).not.toHaveAttribute(
      'inputmode',
      'none',
    );
  });
});

test('with a physical keyboard there is no app keyboard', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Mouse and keyboard only.');
  await page.goto('/play/articles/type');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByRole('group', { name: 'Tastatur' })).toHaveCount(0);
  const field = page.getByRole('textbox', { name: 'Deine Antwort' });
  await field.pressSequentially('größe');
  await expect(field).toHaveValue('größe');
});
