'use client';

import { useEffect, useState } from 'react';

import { readPersistence, type Persistence } from '@/lib/storage/persistence';

/** Whether the browser has promised to keep this site's storage; null until known. */
export function usePersistence(): Persistence | null {
  const [persistence, setPersistence] = useState<Persistence | null>(null);
  useEffect(() => {
    readPersistence()
      .then(setPersistence)
      .catch(() => setPersistence('unsupported'));
  }, []);
  return persistence;
}
