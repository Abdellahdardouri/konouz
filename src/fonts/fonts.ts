import { IBM_Plex_Sans_Arabic } from 'next/font/google';

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--cairo',
  weight: ['400', '500', '600', '700']
});

// Backward-compatible alias — components still import `cairo`
export const cairo = ibmPlexSansArabic;
