/**
 * Asking the browser not to clear this site's storage (progress and the offline copy)
 * when the device runs low. Browsers may grant it silently, refuse, or not support it.
 */

export type Persistence = 'persisted' | 'not-persisted' | 'unsupported';

function storageManager(): StorageManager | undefined {
  return typeof navigator !== 'undefined' ? navigator.storage : undefined;
}

export async function readPersistence(): Promise<Persistence> {
  const storage = storageManager();
  if (!storage?.persisted) return 'unsupported';
  return (await storage.persisted()) ? 'persisted' : 'not-persisted';
}

/** Ask once real use has begun (after a finished round); never throws. */
export async function requestPersistence(): Promise<Persistence> {
  const storage = storageManager();
  if (!storage?.persist) return 'unsupported';
  try {
    if (await storage.persisted()) return 'persisted';
    return (await storage.persist()) ? 'persisted' : 'not-persisted';
  } catch {
    return 'not-persisted';
  }
}
