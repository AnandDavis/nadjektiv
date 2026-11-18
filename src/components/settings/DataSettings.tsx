'use client';

import { useRef, useState } from 'react';

import { Button, Card } from '@/components/ui';
import { deserialiseProgress, serialiseProgress } from '@/lib/progress/transfer';
import { getSnapshot, resetProgress, updateProgress } from '@/lib/storage/progress-client';

type Status =
  { kind: 'idle' } | { kind: 'ok'; message: string } | { kind: 'error'; message: string };

function downloadFile(name: string, contents: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function DataSettings() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  function handleExport() {
    const now = new Date().toISOString();
    downloadFile(
      `grammatik-progress-${now.slice(0, 10)}.json`,
      serialiseProgress(getSnapshot(), now),
    );
    setStatus({ kind: 'ok', message: 'Progress exported.' });
  }

  async function handleImport(file: File) {
    try {
      const imported = deserialiseProgress(await file.text());
      updateProgress(() => imported);
      setStatus({ kind: 'ok', message: 'Progress imported.' });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Import failed.',
      });
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function handleReset() {
    resetProgress();
    setIsConfirmingReset(false);
    setStatus({ kind: 'ok', message: 'Progress reset.' });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Your progress</h2>
        <p className="mt-1 text-sm text-muted">
          Progress is saved on this device only. Export it to keep a backup or move to another
          device.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={handleExport}>
          Export
        </Button>
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          Import
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Progress file to import"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImport(file);
          }}
        />
      </div>
      {isConfirmingReset ? (
        <div className="rounded-2xl border-2 border-wrong bg-wrong-soft p-3">
          <p className="font-semibold text-ink">
            Delete all progress on this device? This can’t be undone.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setIsConfirmingReset(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset}>Yes, reset</Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" className="text-wrong" onClick={() => setIsConfirmingReset(true)}>
          Reset progress
        </Button>
      )}
      <p
        role="status"
        className={status.kind === 'error' ? 'text-sm text-wrong' : 'text-sm text-correct'}
      >
        {status.kind === 'idle' ? '' : status.message}
      </p>
    </Card>
  );
}
