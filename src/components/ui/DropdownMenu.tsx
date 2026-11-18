'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export interface DropdownMenuItem {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
}

interface DropdownMenuProps {
  /** Accessible name of the trigger button. */
  label: string;
  /** Visible content of the trigger button (usually an icon). */
  trigger: ReactNode;
  items: readonly DropdownMenuItem[];
}

/**
 * A menu button with a list of links. Follows the WAI-ARIA menu button pattern:
 * Enter/Space/ArrowDown open it, arrow keys move between items, Escape closes it and
 * returns focus to the button, and clicking outside closes it.
 */
export function DropdownMenu({ label, trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    itemRefs.current[0]?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  function close(returnFocus: boolean) {
    setIsOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const links = itemRefs.current.filter((el): el is HTMLAnchorElement => el !== null);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      links[(index + 1) % links.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      links[(index - 1 + links.length) % links.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      links[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      links[links.length - 1]?.focus();
    } else if (event.key === 'Tab') {
      close(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          'flex size-11 items-center justify-center rounded-full text-xl text-ink transition hover:bg-sunken',
          isOpen && 'bg-sunken',
        )}
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          className="absolute top-full right-0 z-20 mt-2 min-w-48 rounded-2xl border border-line bg-surface p-1.5 shadow-card motion-safe:animate-rise"
        >
          {items.map((item, i) => (
            <Link
              key={item.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={item.href}
              role="menuitem"
              onClick={() => close(false)}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold text-ink hover:bg-sunken focus-visible:bg-sunken"
            >
              {item.icon && <span className="text-lg text-muted">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
