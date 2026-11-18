'use client';

import { useRef, useState } from 'react';

import { Button, Card, Ui } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { deserialiseProgress, serialiseProgress } from '@/lib/progress/transfer';
import { clearReviseList } from '@/lib/progress/clear-revise';
import { getSnapshot, resetProgress, updateProgress } from '@/lib/storage/progress-client';
import { COPY, type Bilingual } from '@/lib/i18n/copy';

import { ConfirmAction } from './ConfirmAction';

type Status =
  { kind: 'idle' } | { kind: 'ok'; message: Bilingual } | { kind: 'error'; message: string };

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

  function handleExport() {
    const now = new Date().toISOString();
    downloadFile(
      `${APP_CONFIG.exportFilePrefix}-${now.slice(0, 10)}.json`,
      serialiseProgress(getSnapshot(), now),
    );
    setStatus({ kind: 'ok', message: COPY.settings.exported });
  }

  async function handleImport(file: File) {
    try {
      const imported = deserialiseProgress(await file.text());
      updateProgress(() => imported);
      setStatus({ kind: 'ok', message: COPY.settings.imported });
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
    setStatus({ kind: 'ok', message: COPY.settings.resetDone });
  }

  function handleClearRevise() {
    updateProgress(clearReviseList);
    setStatus({ kind: 'ok', message: COPY.settings.reviseCleared });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-extrabold tracking-widest text-ink uppercase">
          <Ui {...COPY.settings.yourProgress} />
        </h2>
        <p className="mt-1 text-sm text-muted">
          <Ui {...COPY.settings.progressHint} />
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={handleExport}>
          <Ui {...COPY.settings.export} />
        </Button>
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          <Ui {...COPY.settings.import} />
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
      <ConfirmAction
        label={COPY.settings.clearRevise}
        question={COPY.settings.confirmClearRevise}
        confirmLabel={COPY.settings.confirmClearReviseButton}
        onConfirm={handleClearRevise}
      />
      <ConfirmAction
        label={COPY.settings.reset}
        question={COPY.settings.confirmReset}
        confirmLabel={COPY.settings.confirmResetButton}
        onConfirm={handleReset}
      />
      <p
        role="status"
        className={status.kind === 'error' ? 'text-sm text-wrong' : 'text-sm text-correct'}
      >
        {status.kind === 'ok' && <Ui {...status.message} />}
        {status.kind === 'error' && status.message}
      </p>
    </Card>
  );
}
