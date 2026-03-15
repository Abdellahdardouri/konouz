'use client';

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <h1 className="sr-only">كنوز</h1>
      <h2 className="sr-only">القائمة الرئيسية</h2>
      {children}
    </header>
  );
}
