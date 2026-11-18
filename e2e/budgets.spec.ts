/**
 * Budgets for what a learner downloads, and for being installable as an app.
 */
import { expect, test, type Page } from '@playwright/test';

/**
 * Compressed JavaScript a first visit downloads per page, including what Next.js
 * prefetches for links on screen. Measured at 190–202 KB (November 2026); the budget
 * leaves about 15% headroom. If a change needs more, raise it deliberately in the
 * same commit and say why.
 */
const JS_BUDGET_KB = 230;

async function javascriptKb(page: Page): Promise<number> {
  return page.evaluate(() => {
    const scripts = performance
      .getEntriesByType('resource')
      .filter(
        (entry): entry is PerformanceResourceTiming => entry instanceof PerformanceResourceTiming,
      )
      .filter((entry) => entry.initiatorType === 'script' || entry.name.endsWith('.js'));
    return scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0) / 1024;
  });
}

test.describe('javascript budget', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Budgets are measured once, at phone size.');
  });

  for (const path of [
    '/',
    '/topics/articles',
    '/play/articles/gap',
    '/play/noun-gender/sort',
    '/revise',
    '/about',
  ]) {
    test(`${path} stays within ${JS_BUDGET_KB} KB of JavaScript`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const kb = await javascriptKb(page);
      test.info().annotations.push({ type: 'javascript', description: `${kb.toFixed(1)} KB` });
      console.log(`${path}: ${kb.toFixed(1)} KB`);
      expect(kb).toBeLessThan(JS_BUDGET_KB);
    });
  }
});

test.describe('installable app', () => {
  test.use({ serviceWorkers: 'allow' });

  test('has a complete web manifest with working icons', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.locator('link[rel="manifest"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    const manifest = await (await request.get(href!)).json();

    expect(manifest).toMatchObject({ name: 'Nadjektiv', start_url: '/', display: 'standalone' });
    expect(manifest.short_name.length).toBeLessThanOrEqual(12);
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);

    const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(
      true,
    );
    for (const icon of manifest.icons) {
      const response = await request.get(icon.src);
      expect(response.status(), icon.src).toBe(200);
      expect(response.headers()['content-type']).toBe('image/png');
    }

    await expect(
      page.locator('link[rel="apple-touch-icon"], link[rel="icon"]').first(),
    ).toHaveCount(1);
  });

  test('fetches the manifest with cookies, so a bot check the page passed cannot block it', async ({
    page,
  }) => {
    await page.goto('/');
    // Browsers use the first manifest link; ours must carry use-credentials.
    await expect(page.locator('link[rel="manifest"]').first()).toHaveAttribute(
      'crossorigin',
      'use-credentials',
    );
  });

  test('asks browsers not to translate the German', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('translate', 'no');
    await expect(page.locator('meta[name="google"]')).toHaveAttribute('content', 'notranslate');
  });

  test('registers a service worker that controls the page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
      .toBe(true);
  });
});
