import { describe, expect, it } from 'vitest';

import { assertImportSize, MAX_IMPORT_BYTES } from './transfer';

describe('assertImportSize', () => {
  it('accepts files up to the limit', () => {
    expect(() => assertImportSize(0)).not.toThrow();
    expect(() => assertImportSize(MAX_IMPORT_BYTES)).not.toThrow();
  });

  it('refuses anything bigger with a readable message', () => {
    expect(() => assertImportSize(MAX_IMPORT_BYTES + 1)).toThrow(/too big/);
  });
});
