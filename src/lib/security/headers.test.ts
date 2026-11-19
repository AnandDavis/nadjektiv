import { describe, expect, it } from 'vitest';

import { contentSecurityPolicy, securityHeaders } from './headers';

const PRODUCTION = { dev: false, preview: false };

function directive(policy: string, name: string): string[] {
  const entry = policy.split('; ').find((part) => part.startsWith(`${name} `));
  return entry?.split(' ').slice(1) ?? [];
}

describe('contentSecurityPolicy', () => {
  it('locks production to this origin', () => {
    const policy = contentSecurityPolicy(PRODUCTION);
    expect(directive(policy, 'default-src')).toEqual(["'self'"]);
    expect(directive(policy, 'connect-src')).toEqual(["'self'"]);
    expect(directive(policy, 'object-src')).toEqual(["'none'"]);
    expect(directive(policy, 'frame-ancestors')).toEqual(["'none'"]);
    expect(directive(policy, 'frame-src')).toEqual(["'none'"]);
    expect(policy).not.toContain('unsafe-eval');
    expect(policy).not.toContain('vercel.live');
  });

  it('allows eval only in development', () => {
    expect(directive(contentSecurityPolicy({ ...PRODUCTION, dev: true }), 'script-src')).toContain(
      "'unsafe-eval'",
    );
  });

  it('lets the Vercel toolbar in on preview deployments', () => {
    const policy = contentSecurityPolicy({ ...PRODUCTION, preview: true });
    for (const name of ['script-src', 'connect-src', 'frame-src', 'img-src', 'font-src']) {
      expect(directive(policy, name)).toContain('https://vercel.live');
    }
  });
});

describe('securityHeaders', () => {
  it('sends each header once', () => {
    const keys = securityHeaders(PRODUCTION).map((header) => header.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Referrer-Policy',
        'Permissions-Policy',
      ]),
    );
  });
});
