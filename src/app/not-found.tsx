import { AppHeader } from '@/components/layout/AppHeader';
import { ButtonLink, Ui } from '@/components/ui';
import { COPY } from '@/lib/i18n/copy';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-9xl leading-none font-black tracking-tighter text-red">404</p>
        <h1 className="text-4xl leading-none font-black text-ink">
          <Ui {...COPY.notFound.heading} />
        </h1>
        <ButtonLink href="/">Back to the topics</ButtonLink>
      </main>
    </div>
  );
}
