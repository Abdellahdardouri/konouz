'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { sorting } from '@/lib/constants';
import { createUrl } from '@/lib/utils';

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort');
  const activeItem = sorting.find((item) => item.slug === currentSort) || sorting[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('sort', slug);
    } else {
      params.delete('sort');
    }
    // Reset to page 1 when sorting changes
    params.delete('page');
    router.push(createUrl(pathname, params));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-stone px-3 py-2 font-cairo text-sm text-darkPurple transition-all duration-200 hover:border-gold hover:shadow-warm"
      >
        <span className="text-warm-gray">ترتيب:</span>
        <span>{activeItem?.title}</span>
        <ChevronDown className="h-4 w-4 text-warm-gray" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 min-w-[200px] rounded-lg border border-stone bg-white p-2 shadow-warm-md">
          {sorting.map((item) => {
            const isActive = item.slug === currentSort || (!currentSort && !item.slug);
            return (
              <button
                key={item.slug || 'default'}
                onClick={() => handleSelect(item.slug)}
                className={`flex w-full rounded-md px-3 py-2 text-right font-cairo text-sm transition-colors ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-darkPurple hover:bg-cream'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
