import type { Viewport } from 'next';
import { ReactNode } from 'react';
import { ensureStartsWith } from '@/lib/utils';
import '@/styles/globals.css';
import { cairo } from '@/fonts/fonts';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? 'https://konouz.ma' : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME || 'كنوز',
    template: `%s | ${SITE_NAME || 'كنوز'}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite,
        images: '/images/screenshots/home.webp'
      }
    }),
  icons: { icon: '/favicon.png' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cairo.className}`}>
      <body className="overflow-x-hidden bg-white-warm text-veryDarkPurple">{children}</body>
    </html>
  );
}
