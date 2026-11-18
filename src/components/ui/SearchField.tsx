'use client';

import { useId } from 'react';

import { CrossIcon, SearchIcon } from './icons';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  clearLabel: string;
}

/** A search input with an icon and a clear button. Escape clears it too. */
export function SearchField({ value, onChange, label, placeholder, clearLabel }: SearchFieldProps) {
  const id = useId();
  return (
    <div className="relative flex items-center border-2 border-ink bg-surface focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-focus">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none ml-3 shrink-0 text-xl text-ink" />
      <input
        id={id}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('');
        }}
        className="min-h-12 w-full min-w-0 bg-transparent px-3 text-lg font-bold text-ink placeholder:font-semibold placeholder:text-muted focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onChange('')}
          className="flex size-11 shrink-0 items-center justify-center text-xl text-ink hover:bg-ink hover:text-canvas"
        >
          <CrossIcon />
        </button>
      )}
    </div>
  );
}
