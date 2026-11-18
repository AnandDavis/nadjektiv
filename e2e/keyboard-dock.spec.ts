import { expect, test, type Page } from '@playwright/test';

const KEYBOARD = 300;
// Taller than the space below a typed question, so the keys have to move to stay visible.
const TALL_KEYBOARD = 450;

/** Replace window.visualViewport with one we can shrink, like iOS does for its keyboard. */
async function fakeVisualViewport(page: Page) {
  await page.addInitScript(() => {
    const fake = Object.assign(new EventTarget(), { height: window.innerHeight, offsetTop: 0 });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: fake });
    (window as unknown as { openKeyboard: (h: number) => void }).openKeyboard = (h) => {
      fake.height = window.innerHeight - h;
      fake.dispatchEvent(new Event('resize'));
    };
  });
}

/** Where the dock's bottom edge sits, measured from the bottom of the window. */
async function dockGap(page: Page): Promise<number> {
  return page.evaluate(() => {
    const dock = document.querySelector('[data-keyboard-dock]')!;
    return Math.round(window.innerHeight - dock.getBoundingClientRect().bottom);
  });
}

async function openKeyboard(page: Page, height = KEYBOARD) {
  await page.evaluate(
    (h) => (window as unknown as { openKeyboard: (h: number) => void }).openKeyboard(h),
    height,
  );
}

test('in Tippen, the ä ö ü ß keys sit just above the on-screen keyboard', async ({ page }) => {
  await fakeVisualViewport(page);
  await page.goto('/play/articles/type');
  await page.getByRole('button', { name: /Los geht/ }).click();
  await openKeyboard(page, TALL_KEYBOARD);
  await expect.poll(() => dockGap(page)).toBe(TALL_KEYBOARD);
});

test('in Tabelle, the keys and Fertig sit just above the on-screen keyboard', async ({ page }) => {
  await fakeVisualViewport(page);
  await page.goto('/play/articles/grid');
  await page.getByRole('button', { name: /Der bestimmte Artikel/ }).click();
  expect(await dockGap(page)).toBeLessThan(KEYBOARD);
  await openKeyboard(page);
  await expect.poll(() => dockGap(page)).toBe(KEYBOARD);
});
