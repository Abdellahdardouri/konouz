import { Lora, Quicksand, Cairo } from 'next/font/google';

export const lora = Lora({
  subsets: ['latin'],
  variable: '--lora'
});

export const quicksand = Quicksand({ subsets: ['latin'], variable: '--quicksand' });

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--cairo',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});
