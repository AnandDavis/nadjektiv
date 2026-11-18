'use client';

import type { ReactNode } from 'react';

import { SegmentedControl, Ui } from '@/components/ui';
import { useOption } from '@/hooks/useOption';
import type { Bilingual } from '@/lib/i18n/copy';
import type { OptionDef } from '@/lib/storage/options';

interface OptionControlProps<T extends string> {
  option: OptionDef<T>;
  legend: Bilingual;
  hint?: Bilingual;
  labels: Record<T, Bilingual>;
}

/** One of the learner's options as a row of choices, saved as soon as it changes. */
export function OptionControl<T extends string>({
  option,
  legend,
  hint,
  labels,
}: OptionControlProps<T>) {
  const [value, setValue] = useOption(option);
  const options: ReadonlyArray<{ value: T; label: ReactNode }> = option.values.map((v) => ({
    value: v,
    label: <Ui {...labels[v]} />,
  }));
  return (
    <SegmentedControl
      name={option.key}
      legend={<Ui {...legend} />}
      hint={hint ? <Ui {...hint} /> : undefined}
      value={value}
      options={options}
      onChange={setValue}
    />
  );
}
