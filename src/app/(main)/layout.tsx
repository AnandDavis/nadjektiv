import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { UpdateBar } from '@/components/pwa/UpdateBar';

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <AppHeader />
      <UpdateBar />
      <main className="mx-auto w-full max-w-xl px-4 pt-6 pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
