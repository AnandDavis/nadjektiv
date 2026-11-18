import { describe, expect, it } from 'vitest';

import { currentBuild, describeBuild } from './app-version';

const REPO = 'https://github.com/example/app';
const SHA = '1d66f33a2b4c5d6e7f8091a2b3c4d5e6f7081920';

describe('describeBuild', () => {
  it('shortens the commit, links to it and formats the build time', () => {
    expect(
      describeBuild({ version: '1.2.0', commit: SHA, builtAt: '2026-11-18T16:40:00Z' }, REPO),
    ).toEqual({
      version: '1.2.0',
      commit: '1d66f33',
      commitUrl: `${REPO}/commit/${SHA}`,
      builtAt: '18 Nov 2026, 16:40 UTC',
    });
  });

  it('leaves out what the build did not know', () => {
    expect(describeBuild({ version: '', commit: '', builtAt: undefined }, REPO)).toEqual({
      version: '0.0.0',
      commit: null,
      commitUrl: null,
      builtAt: null,
    });
  });

  it('ignores a commit or time that is not what it claims to be', () => {
    const build = describeBuild({ version: '1.0.0', commit: 'main', builtAt: 'yesterday' }, REPO);
    expect(build.commit).toBeNull();
    expect(build.commitUrl).toBeNull();
    expect(build.builtAt).toBeNull();
  });
});

describe('currentBuild', () => {
  it('reads the values next.config.ts bakes in', () => {
    process.env.APP_VERSION = '3.0.0';
    process.env.BUILD_COMMIT = SHA;
    process.env.BUILD_TIME = '2026-11-18T16:40:00Z';
    try {
      expect(currentBuild(REPO)).toMatchObject({ version: '3.0.0', commit: '1d66f33' });
    } finally {
      delete process.env.APP_VERSION;
      delete process.env.BUILD_COMMIT;
      delete process.env.BUILD_TIME;
    }
  });
});
