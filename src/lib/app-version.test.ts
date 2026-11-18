import { describe, expect, it } from 'vitest';

import { appVersion } from './app-version';

describe('appVersion', () => {
  it('uses the version baked in at build time', () => {
    expect(appVersion('1.2.0')).toBe('1.2.0');
  });

  it('falls back when the build did not set one', () => {
    expect(appVersion('')).toBe('0.0.0');
    expect(appVersion(undefined)).toBe('0.0.0');
  });
});
