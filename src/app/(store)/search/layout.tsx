import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <section className="mx-auto my-[48px] flex w-full max-w-[1440px] flex-col items-center gap-6 px-4 xl:px-12">
        {children}
      </section>
    </Suspense>
  );
}
