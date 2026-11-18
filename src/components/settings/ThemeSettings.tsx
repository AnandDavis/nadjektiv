'use client';

import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import type { ThemePreference } from '@/lib/storage/theme-store';
import { cn } from '@/lib/utils/cn';

const OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
];

export function ThemeSettings() {
  const [theme, setTheme] = useTheme();
  return (
    <Card>
      <fieldset>
        <legend className="font-display text-lg font-bold text-ink">Theme</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border-2 font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus',
                theme === option.value
                  ? 'border-brand bg-sunken text-ink'
                  : 'border-line text-muted',
              )}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={() => setTheme(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </Card>
  );
}
