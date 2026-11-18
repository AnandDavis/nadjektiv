import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <main className="mx-auto w-full max-w-xl px-4 pt-6 pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
