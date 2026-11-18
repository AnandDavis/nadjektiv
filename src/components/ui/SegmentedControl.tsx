import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  name: string;
  legend: ReactNode;
  hint?: ReactNode;
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (value: T) => void;
}

/** A row of mutually exclusive choices, built on native radio inputs. */
export function SegmentedControl<T extends string>({
  name,
  legend,
  hint,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <fieldset>
      <legend className="font-display text-lg font-bold text-ink">{legend}</legend>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border-2 px-2 text-center font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus',
              value === option.value ? 'border-brand bg-sunken text-ink' : 'border-line text-muted',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
