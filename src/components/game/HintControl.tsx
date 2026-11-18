import { Button, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

interface HintControlProps {
  hint: string;
  isShown: boolean;
  onShow: () => void;
}

/** One hint per question: a button until used, then the rule with the answer blanked. */
export function HintControl({ hint, isShown, onShow }: HintControlProps) {
  if (!isShown) {
    return (
      <Button variant="ghost" className="self-start" onClick={onShow}>
        <Ui {...COPY.hint.show} />
      </Button>
    );
  }
  return (
    <div className="border-2 border-ink bg-yellow px-4 py-3 text-on-yellow">
      <p className="text-xs font-extrabold tracking-widest uppercase">
        <Ui {...COPY.hint.label} />
      </p>
      <p className="mt-1 text-sm">{hint}</p>
    </div>
  );
}
