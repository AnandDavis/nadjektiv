'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Shape } from '@/components/ui';

interface AboutSectionProps {
  /** Also the URL fragment that opens it: /about#changelog. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/**
 * One collapsible part of the About page: a native <details>, so it works without
 * script and with the keyboard. A link to /about#id opens it.
 */
export function AboutSection({ id, title, children }: AboutSectionProps) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash === `#${id}` && details.current) {
        details.current.open = true;
        details.current.scrollIntoView();
      }
    };
    openIfTargeted();
    window.addEventListener('hashchange', openIfTargeted);
    return () => window.removeEventListener('hashchange', openIfTargeted);
  }, [id]);

  return (
    <details ref={details} id={id} className="group border-t-4 border-ink">
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-4 py-5 hover:bg-sunken">
        <h2 className="flex-1 text-2xl leading-none font-black text-ink uppercase">{title}</h2>
        <Shape
          kind="triangle"
          color="ink"
          className="shrink-0 rotate-90 text-lg transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="flex flex-col gap-3 px-1 pt-2 pb-10">{children}</div>
    </details>
  );
}
