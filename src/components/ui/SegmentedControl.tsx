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
      <legend className="text-xs font-extrabold tracking-widest text-ink uppercase">
        {legend}
      </legend>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div
        className="mt-3 grid border-2 border-ink"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex min-h-11 cursor-pointer items-center justify-center border-l-2 border-ink px-2 text-center text-sm font-extrabold uppercase first:border-l-0 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus',
              value === option.value ? 'bg-ink text-canvas' : 'text-ink hover:bg-sunken',
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
