/**
 * What the About page says about the running build. The raw values are baked in by
 * next.config.ts; this turns them into display text and a link to the commit.
 */
import { formatUtcTimestamp } from '@/lib/utils/format-date';

export interface BuildValues {
  version: string | undefined;
  commit: string | undefined;
  builtAt: string | undefined;
}

export interface BuildDescription {
  version: string;
  /** First 7 characters of the commit, or null when the build didn't know it. */
  commit: string | null;
  commitUrl: string | null;
  /** "18 Nov 2026, 16:40 UTC", or null when unknown or unreadable. */
  builtAt: string | null;
}

const SHA = /^[0-9a-f]{7,40}$/i;

export function describeBuild(values: BuildValues, repositoryUrl: string): BuildDescription {
  const commit = values.commit && SHA.test(values.commit) ? values.commit.toLowerCase() : null;
  let builtAt: string | null = null;
  try {
    builtAt = values.builtAt ? formatUtcTimestamp(values.builtAt) : null;
  } catch {
    builtAt = null;
  }
  return {
    version: values.version || '0.0.0',
    commit: commit ? commit.slice(0, 7) : null,
    commitUrl: commit ? `${repositoryUrl}/commit/${commit}` : null,
    builtAt,
  };
}

/** This build. process.env.X must be written out literally for Next.js to inline it. */
export function currentBuild(repositoryUrl: string): BuildDescription {
  return describeBuild(
    {
      version: process.env.APP_VERSION,
      commit: process.env.BUILD_COMMIT,
      builtAt: process.env.BUILD_TIME,
    },
    repositoryUrl,
  );
}
