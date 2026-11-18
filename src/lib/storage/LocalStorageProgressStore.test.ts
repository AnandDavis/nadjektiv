import { describe, expect, it } from 'vitest';

import { createEmptyProgress } from '../progress/types';
import { deserialiseProgress, serialiseProgress } from '../progress/transfer';
import {
  BACKUP_KEY_PREFIX,
  LocalStorageProgressStore,
  PROGRESS_KEY,
} from './LocalStorageProgressStore';

describe('LocalStorageProgressStore', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(new LocalStorageProgressStore(window.localStorage).load()).toEqual(
      createEmptyProgress(),
    );
  });

  it('round-trips saved progress', () => {
    const store = new LocalStorageProgressStore(window.localStorage);
    const progress = { ...createEmptyProgress(), xp: 120 };
    store.save(progress);
    expect(store.load()).toEqual(progress);
  });

  it('backs up corrupt data instead of discarding it', () => {
    window.localStorage.setItem(PROGRESS_KEY, '{"version":1,"xp":"lots"}');
    const store = new LocalStorageProgressStore(window.localStorage);
    expect(store.load()).toEqual(createEmptyProgress());
    const backups = Object.keys(window.localStorage).filter((k) => k.startsWith(BACKUP_KEY_PREFIX));
    expect(backups).toHaveLength(1);
    expect(window.localStorage.getItem(backups[0])).toBe('{"version":1,"xp":"lots"}');
  });

  it('clears progress', () => {
    const store = new LocalStorageProgressStore(window.localStorage);
    store.save({ ...createEmptyProgress(), xp: 5 });
    store.clear();
    expect(store.load().xp).toBe(0);
  });
});

describe('progress transfer', () => {
  it('round-trips an export', () => {
    const progress = { ...createEmptyProgress(), xp: 42 };
    expect(deserialiseProgress(serialiseProgress(progress, '2026-11-18T00:00:00Z'))).toEqual(
      progress,
    );
  });

  it('rejects files from elsewhere', () => {
    expect(() => deserialiseProgress('{"hello":1}')).toThrow(/isn’t a Grammatik Games/);
    expect(() => deserialiseProgress('not json')).toThrow(/valid JSON/);
  });
});
