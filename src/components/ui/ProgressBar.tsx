import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  label: string;
  className?: string;
  /** Tailwind background utility for the filled part. */
  fillClassName?: string;
}

export function ProgressBar({
  value,
  label,
  className,
  fillClassName = 'bg-brand',
}: ProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('h-3 w-full overflow-hidden rounded-full bg-sunken', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', fillClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
