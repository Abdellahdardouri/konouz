import { getMenu } from '@/lib/shopify';

import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './mobile-menu';

// components
import Cart from '@/components/cart';
import OpenCart from '@/components/cart/open-cart';
import { Suspense } from 'react';
import HeaderShell from './HeaderShell';
import Menu from './Menu';
import Search from './search';

const Header = async () => {
  const menu = await getMenu('main-menu');
  return (
    <HeaderShell>
      {/* ── Tier 1: Brand bar (dark) ── */}
      <div
        className="h-[60px]"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.08) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 50%, rgba(200,169,110,0.05) 0%, transparent 50%),
                       linear-gradient(180deg, #1E1C19 0%, #252220 100%)`
        }}
      >
        <nav className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-4 px-4 xl:px-12">
          {/* Right side (RTL): Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <Image
              src="/images/logo.png"
              alt="كنوز"
              width={36}
              height={36}
              className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <span className="hidden font-cairo text-2xl font-semibold text-gold transition-colors duration-200 group-hover:text-gold-light sm:inline">
              كنوز
            </span>
          </Link>

          {/* Center: Search bar */}
          <div className="flex flex-1 justify-center md:max-w-[75%]">
            <Suspense>
              <Search variant="header" />
            </Suspense>
          </div>

          {/* Left side (RTL): Cart + Mobile menu */}
          <div className="flex shrink-0 items-center gap-3">
            <Suspense fallback={<OpenCart />}>
              <Cart />
            </Suspense>
            <div className="md:hidden">
              <MobileMenu menu={menu} />
            </div>
          </div>
        </nav>
      </div>

      {/* ── Tier 2: Category bar ── */}
      <div className="hidden border-b border-gold/30 bg-sand shadow-[0_2px_8px_rgba(30,28,25,0.06)] md:block">
        <div className="mx-auto w-full max-w-[1440px] px-4 xl:px-12">
          <Menu menu={menu} />
        </div>
      </div>
    </HeaderShell>
  );
};

export default Header;
