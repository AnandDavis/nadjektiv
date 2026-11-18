/**
 * Visual regression: screenshots of the key screens, compared against committed
 * baselines. A change to the design should show up here as a deliberate diff.
 *
 * Update baselines after an intended visual change:
 *   npx playwright test visual --update-snapshots
 *
 * Baselines are per platform (the file name ends in -darwin or -linux), because font
 * rendering differs between operating systems. Only -darwin baselines are committed,
 * so the spec skips itself elsewhere (CI runs on Linux).
 */
import { expect, test, type Page } from '@playwright/test';

// Freezing time also freezes question order: sessions are seeded from the clock.
const FIXED_TIME = new Date('2026-11-18T10:00:00Z');

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Visual baselines are taken at phone size only.');
  test.skip(process.platform !== 'darwin', 'Baselines are committed for macOS only.');
  await page.clock.setFixedTime(FIXED_TIME);
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function snap(page: Page, name: string, fullPage = false) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage,
    animations: 'disabled',
    caret: 'hide',
    // Rendering is deterministic on one machine, so even a changed word must fail.
    maxDiffPixels: 40,
  });
}

async function playGapRound(page: Page) {
  await page.goto('/play/articles/gap');
  await page.getByRole('button', { name: /Los geht/ }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Weiter' }).click();
  }
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(colorScheme, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme });
    });

    test('home', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('Anfänger')).toBeVisible();
      await snap(page, `home-${colorScheme}`);
    });

    test('topic page', async ({ page }) => {
      await page.goto('/topics/articles');
      await expect(page.getByText(/Nächstes Ziel/)).toBeVisible();
      await snap(page, `topic-${colorScheme}`);
    });

    test('blitz question and wrong-answer feedback', async ({ page }) => {
      await page.goto('/play/noun-gender/sort');
      await page.getByRole('button', { name: /Los geht/ }).click();
      await snap(page, `blitz-question-${colorScheme}`);
      const bins = page.getByRole('group', { name: 'Sort into' });
      // With the clock frozen the first prompt is always the same; pick a wrong bin.
      const answer = await page.evaluate(
        () => document.querySelector('[lang="de"].text-4xl')?.textContent,
      );
      await bins.getByRole('button', { name: answer?.startsWith('Ä') ? 'der' : 'das' }).click();
      await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
      await snap(page, `blitz-feedback-${colorScheme}`);
    });

    test('gap question', async ({ page }) => {
      await page.goto('/play/articles/gap');
      await page.getByRole('button', { name: /Los geht/ }).click();
      await snap(page, `gap-question-${colorScheme}`);
    });

    test('results, revise and progress after a round', async ({ page }) => {
      await playGapRound(page);
      await expect(page.getByRole('heading', { level: 2 })).toBeFocused();
      await snap(page, `results-${colorScheme}`);
      await page.goto('/revise');
      await expect(page.getByText('Deine Wahl').first()).toBeVisible();
      await snap(page, `revise-${colorScheme}`);
      await page.goto('/progress');
      await expect(page.getByText('Medaillen')).toBeVisible();
      await snap(page, `progress-${colorScheme}`);
    });

    test('grid fill', async ({ page }) => {
      await page.goto('/play/articles/grid');
      await snap(page, `grid-picker-${colorScheme}`);
      await page.getByRole('button', { name: /Der bestimmte Artikel/ }).click();
      await page.getByRole('textbox', { name: 'Akk M' }).fill('den');
      await page.getByRole('textbox', { name: 'Akk F' }).fill('der');
      await snap(page, `grid-playing-${colorScheme}`);
    });

    test('welcome intro', async ({ page }) => {
      await page.goto('/welcome');
      await snap(page, `welcome-hello-${colorScheme}`);
      await page.getByRole('button', { name: 'Weiter' }).click();
      await snap(page, `welcome-games-${colorScheme}`);
      await page.getByRole('button', { name: 'Weiter' }).click();
      await snap(page, `welcome-progress-${colorScheme}`);
    });

    test('about', async ({ page }) => {
      await page.goto('/about');
      await snap(page, `about-${colorScheme}`, true);
    });
  });
}
