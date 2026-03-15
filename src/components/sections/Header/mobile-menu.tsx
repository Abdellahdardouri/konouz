'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import Logo from '@/components/layout/Logo';
import { Menu } from '@/lib/shopify/types';
import { Spin as Hamburger } from 'hamburger-react';

// ── Hardcoded nav structure (same as desktop) ──────────────────────────
type NavChild = { title: string; path: string };
type NavItem = {
  title: string;
  path: string;
  children?: NavChild[];
  secondary?: boolean;
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
  { title: 'وصل حديثاً', path: '/search/new-arrivals', secondary: true },
  { title: 'الرائجة', path: '/search/trending', secondary: true },
  { title: 'من نحن', path: '/about-us', secondary: true }
];

export default function MobileMenu({ menu: _menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const closeMobileMenu = () => setIsOpen(false);

  const toggleAccordion = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  const primaryItems = NAV_ITEMS.filter((i) => !i.secondary);
  const secondaryItems = NAV_ITEMS.filter((i) => i.secondary);

  return (
    <>
      <div className="relative z-40 text-white">
        <Hamburger
          toggled={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          label="افتح القائمة"
          size={22}
          color="currentColor"
        />
      </div>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-0 flex h-full w-full flex-col bg-[#1E1C19F7] backdrop-blur-md">
              {/* Top bar: logo + close */}
              <div className="flex items-center justify-between px-6 pt-6">
                <Logo size="sm" className="[&_span]:text-white" />
                <button
                  onClick={closeMobileMenu}
                  aria-label="أغلق القائمة"
                  className="text-gold transition-colors duration-200 hover:text-gold-light"
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>
              </div>

              {/* ── Primary nav links with accordions ── */}
              <ul className="mt-12 flex w-full flex-col gap-2 px-8">
                {primaryItems.map((item, index) => (
                  <li
                    key={item.title}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    {item.children ? (
                      <>
                        {/* Accordion trigger */}
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="flex w-full items-center justify-between py-3 font-cairo text-2xl font-medium text-white transition-colors duration-200 hover:text-gold"
                        >
                          <span>{item.title}</span>
                          <ChevronDownIcon
                            className={`h-5 w-5 text-gold transition-transform duration-200 ${
                              expandedIndex === index ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Accordion content */}
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            expandedIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="mr-4 flex flex-col gap-1 pb-2">
                            {item.children.map((child, subIndex) => (
                              <li
                                key={child.path}
                                className="animate-fadeIn"
                                style={{
                                  animationDelay: `${subIndex * 30}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                <Link
                                  href={child.path}
                                  onClick={closeMobileMenu}
                                  className="block py-2 font-cairo text-lg font-medium text-white/70 transition-colors duration-200 hover:text-gold"
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={closeMobileMenu}
                        className="block py-3 font-cairo text-2xl font-medium text-white transition-colors duration-200 hover:text-gold"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* ── Secondary items ── */}
              <ul className="mt-6 flex w-full flex-col gap-1 border-t border-white/10 px-8 pt-6">
                {secondaryItems.map((item, index) => (
                  <li
                    key={item.title}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${(primaryItems.length + index) * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <Link
                      href={item.path}
                      onClick={closeMobileMenu}
                      className="block py-2 font-cairo text-lg font-normal text-white/60 transition-colors duration-200 hover:text-gold"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
