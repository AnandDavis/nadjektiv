import { describe, expect, it } from 'vitest';

import { serviceWorkerSource } from './service-worker-source';

const source = serviceWorkerSource('v1', ['/', '/revise']);

describe('serviceWorkerSource', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(source)).not.toThrow();
  });

  it('embeds the version and precache list', () => {
    expect(source).toContain('const VERSION = "v1";');
    expect(source).toContain('const PRECACHE = ["/","/revise"];');
  });

  it('finds static asset references in page HTML, including inside inline RSC data', () => {
    const pattern = new Function(
      `${source.split('\n').find((l) => l.startsWith('const STATIC_REF'))}; return STATIC_REF;`,
    )() as RegExp;
    const html = [
      '<link rel="stylesheet" href="/_next/static/chunks/abc-123.css">',
      '<script src="/_next/static/chunks/main-9f.js" async></script>',
      '<script>self.__next_f.push([1,"I[\\"/_next/static/chunks/page-77.js\\"]"])</script>',
    ].join('');
    expect(html.match(pattern)).toEqual([
      '/_next/static/chunks/abc-123.css',
      '/_next/static/chunks/main-9f.js',
      '/_next/static/chunks/page-77.js',
    ]);
  });
});
