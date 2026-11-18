import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { APP_CONFIG } from './app';

describe('APP_CONFIG colours', () => {
  it('match the page background in the stylesheet, so the browser bar blends in', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const match = css.match(/--canvas:\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/i);
    expect(match).not.toBeNull();
    expect([APP_CONFIG.colors.canvasLight, APP_CONFIG.colors.canvasDark]).toEqual([
      match![1].toLowerCase(),
      match![2].toLowerCase(),
    ]);
  });
});
