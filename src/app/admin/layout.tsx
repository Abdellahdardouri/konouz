import { ReactNode } from 'react';
import { cairo } from '@/fonts/fonts';
import '@/styles/globals.css';

export const metadata = {
  title: { default: 'لوحة التحكم - كنوز', template: '%s | لوحة التحكم - كنوز' },
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={`${cairo.variable} font-cairo`}>
      {children}
    </div>
  );
}
