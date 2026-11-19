'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Shape } from './Shape';

interface FoldSectionProps {
  /** Also the URL fragment that opens it: /about#changelog. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/**
 * A section that folds away under its heading: a native <details>, so it works without
 * script and with the keyboard. A link to its #id opens it.
 */
export function FoldSection({ id, title, children }: FoldSectionProps) {
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
      {/* Rises in each time it opens (closed content isn't rendered, so it replays). */}
      <div className="flex flex-col gap-3 px-1 pt-2 pb-10 motion-safe:animate-rise">{children}</div>
    </details>
  );
}
