/** The app version from package.json, baked in by next.config.ts. */
export function appVersion(raw: string | undefined = process.env.APP_VERSION): string {
  return raw || '0.0.0';
}
