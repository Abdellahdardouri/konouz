'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Sparkles, TrendingUp, Users } from 'lucide-react';

import { Menu as MenuType } from '@/lib/shopify/types';

// ── Hardcoded nav structure ────────────────────────────────────────────
type NavChild = { title: string; path: string };
type NavItem = {
  title: string;
  path: string;
  children?: NavChild[];
  secondary?: boolean;
  icon?: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { title: 'كل المنتجات', path: '/search' },
  {
    title: 'المطبخ',
    path: '/search/tanzim-al-matbakh',
    children: [
      { title: 'تنظيم المطبخ', path: '/search/tanzim-al-matbakh' },
      { title: 'تخزين الطعام', path: '/search/takhzin-at-taam' },
      { title: 'تجفيف الأطباق', path: '/search/tajfif-al-atbaq' }
    ]
  },
  {
    title: 'تنظيم المنزل',
    path: '/search/adawat-manziliyya',
    children: [
      { title: 'أدوات منزلية عملية', path: '/search/adawat-manziliyya' },
      { title: 'تنظيم الغسيل', path: '/search/tanzim-al-ghasil' },
      { title: 'سلال التخزين', path: '/search/silal-at-takhzin' }
    ]
  },
  {
    title: 'الحمام والتنظيف',
    path: '/search/tanzim-al-hammam',
    children: [
      { title: 'تنظيم الحمام', path: '/search/tanzim-al-hammam' },
      { title: 'أدوات التنظيف', path: '/search/adawat-at-tanzif' }
    ]
  },
  {
    title: 'وصل حديثاً',
    path: '/search/new-arrivals',
    secondary: true,
    icon: <Sparkles size={14} strokeWidth={1.5} />
  },
  {
    title: 'الرائجة',
    path: '/search/trending',
    secondary: true,
    icon: <TrendingUp size={14} strokeWidth={1.5} />
  },
  {
    title: 'من نحن',
    path: '/about-us',
    secondary: true,
    icon: <Users size={14} strokeWidth={1.5} />
  }
];

// ── Component ──────────────────────────────────────────────────────────
const Menu = ({ menu: _menu }: { menu: MenuType[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = useCallback((index: number) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setOpenIndex(null);
      closeTimer.current = null;
    }, 150);
  }, []);

  // Split into primary and secondary items
  const primaryItems = NAV_ITEMS.filter((i) => !i.secondary);
  const secondaryItems = NAV_ITEMS.filter((i) => i.secondary);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <ul className="flex h-11 items-center gap-0.5 font-cairo text-[15px] font-medium lg:gap-1">
      {/* ── Primary items ── */}
      {primaryItems.map((item, index) => {
        const active = isActive(item.path);
        return (
          <li
            key={item.title}
            className="group relative"
            onMouseEnter={() => item.children && handleMouseEnter(index)}
            onMouseLeave={() => item.children && handleMouseLeave()}
          >
            <Link
              href={item.path}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-all duration-200 ${
                active
                  ? 'bg-gold/20 font-bold text-gold-dark'
                  : 'hover:bg-gold/15 text-charcoal hover:text-gold-dark'
              }`}
            >
              {item.title}
              {item.children && (
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  } opacity-50`}
                />
              )}
            </Link>

            {/* ── Mega-menu dropdown ── */}
            {item.children && (
              <div
                className={`absolute right-0 top-full z-50 min-w-[220px] rounded-lg border border-stone/40 bg-white px-5 py-3 shadow-warm-md transition-all duration-200 ${
                  openIndex === index
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 translate-y-2'
                }`}
              >
                <ul className="flex flex-col gap-0.5">
                  {item.children.map((child) => {
                    const childActive = pathname === child.path;
                    return (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className={`block rounded-md px-3 py-2 font-cairo text-[15px] transition-all duration-150 ${
                            childActive
                              ? 'bg-gold/15 text-gold-dark'
                              : 'text-charcoal hover:bg-gold/10 hover:text-gold-dark hover:translate-x-[-2px]'
                          }`}
                        >
                          {child.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}

      {/* ── Spacer to push secondary items to the left ── */}
      <li className="flex-1" aria-hidden="true" />

      {/* ── Secondary items — same font, with icons ── */}
      {secondaryItems.map((item) => {
        const active = isActive(item.path);
        return (
          <li key={item.title}>
            <Link
              href={item.path}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-cairo text-[14px] font-medium transition-all duration-200 ${
                active
                  ? 'bg-gold/20 font-bold text-gold-dark'
                  : 'hover:bg-gold/15 text-charcoal/70 hover:text-gold-dark'
              }`}
            >
              <span className={active ? 'text-gold-dark' : 'text-warm-gray'}>{item.icon}</span>
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
