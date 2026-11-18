import { ButtonLink } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-strong">404</p>
      <h1 className="font-display text-2xl font-bold text-ink">Diese Seite gibt es nicht.</h1>
      <p className="text-muted">That page doesn’t exist.</p>
      <ButtonLink href="/">Back to the topics</ButtonLink>
    </main>
  );
}
