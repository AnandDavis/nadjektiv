import { ButtonLink, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-strong">404</p>
      <h1 className="font-display text-2xl font-bold text-ink">
        <Ui {...COPY.notFound.heading} />
      </h1>
      <ButtonLink href="/">Back to the topics</ButtonLink>
    </main>
  );
}
