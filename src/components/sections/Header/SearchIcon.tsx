'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Search from './search';

const SearchIcon = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchVisible && ref.current) {
      ref.current.querySelector<HTMLInputElement>('input')?.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchVisible(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        title="بحث"
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="hidden text-darkPurple transition-colors duration-300 hover:text-purple md:block"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {isSearchVisible && (
          <LazyMotion features={domAnimation}>
            <m.div
              className="fixed inset-0 z-[60] flex items-start justify-center bg-[#1E1C19F7] backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setIsSearchVisible(false)}
            >
              <div
                className="mt-32 w-full max-w-xl px-6"
                onClick={(e) => e.stopPropagation()}
                ref={ref}
              >
                <div className="mb-6 flex items-center justify-end">
                  <button
                    onClick={() => setIsSearchVisible(false)}
                    className="text-gold transition-colors hover:text-gold-light"
                    aria-label="أغلق البحث"
                  >
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                </div>
                <Search variant="overlay" />
              </div>
            </m.div>
          </LazyMotion>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchIcon;
