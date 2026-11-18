'use client';

import { useState } from 'react';

import { Button, Ui } from '@/components/ui';
import { COPY, type Bilingual } from '@/lib/i18n/copy';

interface ConfirmActionProps {
  label: Bilingual;
  question: Bilingual;
  confirmLabel: Bilingual;
  onConfirm: () => void;
}

/** A destructive action behind a second step that says what will happen. */
export function ConfirmAction({ label, question, confirmLabel, onConfirm }: ConfirmActionProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <Button variant="ghost" className="text-wrong" onClick={() => setIsConfirming(true)}>
        <Ui {...label} />
      </Button>
    );
  }
  return (
    <div className="border-2 border-wrong bg-wrong-soft p-3">
      <p className="font-semibold text-ink">
        <Ui {...question} />
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setIsConfirming(false)}>
          <Ui {...COPY.settings.cancel} />
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            setIsConfirming(false);
          }}
        >
          <Ui {...confirmLabel} />
        </Button>
      </div>
    </div>
  );
}
