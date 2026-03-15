'use client';

import { createUrl } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Search as SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const popularSearches = ['تنظيم المطبخ', 'سلال تخزين', 'أدوات تنظيف', 'رف توابل'];

export default function Search({
  variant = 'default'
}: {
  variant?: 'default' | 'overlay' | 'header';
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
    setShowDropdown(false);
  }

  // ── Autocomplete state (header variant only) ──
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [results, setResults] = useState<{ title: string; handle: string; image: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Reset query when searchParams change (e.g. navigating)
  useEffect(() => {
    setQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    if (variant !== 'header') return;
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}&limit=5`);
        const json = await res.json();
        if (json.success) {
          setResults(
            json.data.map((p: any) => ({
              title: p.title,
              handle: p.handle,
              image: p.images?.[0]?.url || ''
            }))
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, variant]);

  // Close dropdown on click outside
  useEffect(() => {
    if (variant !== 'header') return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  // Close on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }, []);

  const navigateToSearch = useCallback(
    (term: string) => {
      setQuery(term);
      setShowDropdown(false);
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('q', term);
      router.push(createUrl('/search', newParams));
    },
    [router, searchParams]
  );

  if (variant === 'header') {
    return (
      <div ref={wrapperRef} className="relative w-full">
        <form onSubmit={onSubmit} className="relative w-full">
          <input
            type="text"
            name="search"
            placeholder="ابحث في كنوز..."
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="border-stone-400 placeholder:text-stone-400 focus:ring-gold/15 h-[42px] w-full rounded-lg border-[1.5px] bg-white px-4 pr-10 font-cairo text-[15px] text-charcoal outline-none focus:border-gold focus:ring-2"
          />
          <div className="absolute right-0 top-0 flex h-full items-center pr-3">
            <SearchIcon size={18} strokeWidth={1.5} className="text-stone-400" />
          </div>
        </form>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[400px] overflow-y-auto rounded-lg border border-stone/30 bg-white shadow-warm-md">
            {/* Popular searches when query is empty */}
            {query.length === 0 && (
              <div className="p-3">
                <p className="mb-2 font-cairo text-xs font-semibold text-warm-gray">بحث شائع</p>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => navigateToSearch(term)}
                    className="block w-full rounded-md px-3 py-2 text-right font-cairo text-sm text-darkPurple transition-colors hover:bg-sand"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {loading && query.length >= 2 && (
              <div className="flex items-center justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone border-t-gold" />
              </div>
            )}

            {/* Live results */}
            {!loading && results.length > 0 && (
              <div className="p-2">
                {results.map((r) => (
                  <a
                    key={r.handle}
                    href={`/product/${r.handle}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sand"
                  >
                    {r.image && (
                      <img src={r.image} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <span className="font-cairo text-sm text-darkPurple">{r.title}</span>
                  </a>
                ))}
                <button
                  onClick={() => navigateToSearch(query)}
                  className="mt-1 block w-full rounded-md px-3 py-2 text-center font-cairo text-xs font-semibold text-gold transition-colors hover:bg-sand"
                >
                  عرض كل النتائج
                </button>
              </div>
            )}

            {/* No results */}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-4 text-center font-cairo text-sm text-warm-gray">لا توجد نتائج</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <form onSubmit={onSubmit} className="relative w-full">
        <input
          key={searchParams?.get('q')}
          type="text"
          name="search"
          placeholder="ابحث عن منتج..."
          autoComplete="off"
          autoFocus
          defaultValue={searchParams?.get('q') || ''}
          className="w-full border-b-2 border-gold bg-transparent px-2 pb-3 pt-1 font-cairo text-2xl text-white outline-none placeholder:text-white/40"
        />
        <div className="absolute left-0 top-0 flex h-full items-center pl-2">
          <MagnifyingGlassIcon className="h-6 w-6 text-gold" />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-[550px] lg:w-80 xl:w-full">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder="ابحث عن منتج"
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full rounded-lg border border-purple bg-white/80 px-4 py-2 text-sm outline-none placeholder:text-purple focus-visible:outline"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
