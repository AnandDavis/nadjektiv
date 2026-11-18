import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { APP_CONFIG } from './app';

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

/** The [light, dark] pair of a `--name: light-dark(#light, #dark)` token. */
function token(name: string): [string, string] {
  const match = css.match(
    new RegExp(`--${name}:\\s*light-dark\\((#[0-9a-f]{6}),\\s*(#[0-9a-f]{6})\\)`, 'i'),
  );
  expect(match, `--${name} in globals.css`).not.toBeNull();
  return [match![1].toLowerCase(), match![2].toLowerCase()];
}

describe('APP_CONFIG colours', () => {
  it('give the browser bar the header colour (--ink)', () => {
    expect([APP_CONFIG.colors.headerLight, APP_CONFIG.colors.headerDark]).toEqual(token('ink'));
  });

  it('give the splash screen the page colour (--canvas)', () => {
    expect([APP_CONFIG.colors.canvasLight, APP_CONFIG.colors.canvasDark]).toEqual(token('canvas'));
  });
});
