'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

const categories = [
  { handle: 'tanzim-al-matbakh', name: 'تنظيم المطبخ' },
  { handle: 'tanzim-al-hammam', name: 'تنظيم الحمام' },
  { handle: 'takhzin-at-taam', name: 'تخزين الطعام' },
  { handle: 'adawat-manziliyya', name: 'أدوات منزلية عملية' },
  { handle: 'tanzim-al-ghasil', name: 'تنظيم الغسيل' },
  { handle: 'tajfif-al-atbaq', name: 'تجفيف الأطباق' },
  { handle: 'silal-at-takhzin', name: 'سلال التخزين' },
  { handle: 'adawat-at-tanzif', name: 'أدوات التنظيف' }
];

const priceRanges = [
  { label: 'أقل من 100 د.م.', min: 0, max: 100 },
  { label: '100 - 200 د.م.', min: 100, max: 200 },
  { label: '200 - 400 د.م.', min: 200, max: 400 },
  { label: 'أكثر من 400 د.م.', min: 400, max: Infinity }
];

function isPriceRangeActive(
  searchParams: URLSearchParams,
  range: { min: number; max: number }
): boolean {
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (!minPrice && !maxPrice) return false;

  // Multiple ranges are encoded as comma-separated values
  const mins = minPrice ? minPrice.split(',').map(Number) : [];
  const maxes = maxPrice ? maxPrice.split(',').map(Number) : [];

  for (let i = 0; i < mins.length; i++) {
    if (
      mins[i] === range.min &&
      (maxes[i] === range.max || (range.max === Infinity && !maxes[i]))
    ) {
      return true;
    }
  }
  return false;
}

function togglePriceRange(
  searchParams: URLSearchParams,
  pathname: string,
  range: { min: number; max: number }
): string {
  const params = new URLSearchParams(searchParams.toString());

  // Parse existing ranges
  const existingMins = params.get('minPrice') ? params.get('minPrice')!.split(',').map(Number) : [];
  const existingMaxes = params.get('maxPrice') ? params.get('maxPrice')!.split(',') : [];

  // Check if this range is already active
  let found = false;
  const newMins: number[] = [];
  const newMaxes: string[] = [];

  for (let i = 0; i < existingMins.length; i++) {
    const isMatch =
      existingMins[i] === range.min &&
      ((range.max === Infinity && existingMaxes[i] === 'Infinity') ||
        Number(existingMaxes[i]) === range.max);
    if (isMatch) {
      found = true;
      // Skip this one (remove it)
    } else {
      newMins.push(existingMins[i]!);
      newMaxes.push(existingMaxes[i]!);
    }
  }

  if (!found) {
    newMins.push(range.min);
    newMaxes.push(range.max === Infinity ? 'Infinity' : String(range.max));
  }

  if (newMins.length === 0) {
    params.delete('minPrice');
    params.delete('maxPrice');
  } else {
    params.set('minPrice', newMins.join(','));
    params.set('maxPrice', newMaxes.join(','));
  }

  // Reset to page 1 when filtering
  params.delete('page');

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function hasActiveFilters(searchParams: URLSearchParams): boolean {
  return searchParams.has('minPrice') || searchParams.has('maxPrice');
}

function PriceRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <h3 className="mb-4 font-cairo text-lg font-bold text-veryDarkPurple">السعر</h3>
      <ul className="flex flex-col gap-3">
        {priceRanges.map((range) => {
          const isActive = isPriceRangeActive(searchParams, range);
          return (
            <li key={range.label}>
              <button
                onClick={() => router.push(togglePriceRange(searchParams, pathname, range))}
                className="group/filter flex w-full items-center gap-3 text-right font-cairo text-sm text-darkPurple transition-all duration-200 hover:text-gold"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    isActive ? 'border-gold bg-gold' : 'border-stone hover:border-gold'
                  }`}
                >
                  {isActive && <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                </span>
                <span>{range.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ClearFiltersButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!hasActiveFilters(searchParams)) return null;

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <button
      onClick={handleClear}
      className="mt-5 w-full rounded-lg border border-stone py-2 font-cairo text-sm text-darkPurple transition-all duration-200 hover:border-gold hover:bg-gold/5 hover:text-gold hover:shadow-warm active:scale-[0.97]"
    >
      مسح الفلاتر
    </button>
  );
}

export default function FilterSidebar({ currentCollection }: { currentCollection?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const isCollectionPage = pathname.startsWith('/search/');

  return (
    <aside className="hidden w-[260px] min-w-[260px] rounded-xl bg-gold/10 p-5 lg:block">
      <div className="sticky top-[120px]">
        {/* Category filter - only show on /search, not /search/[collection] */}
        {!isCollectionPage && (
          <div>
            <h3 className="mb-4 font-cairo text-lg font-bold text-veryDarkPurple">الفئة</h3>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => {
                const isActive = currentCollection === cat.handle;
                return (
                  <li key={cat.handle}>
                    <button
                      onClick={() => router.push(`/search/${cat.handle}`)}
                      className="group/filter flex w-full items-center gap-3 text-right font-cairo text-sm text-darkPurple transition-all duration-200 hover:text-gold"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isActive ? 'border-gold bg-gold' : 'border-stone hover:border-gold'
                        }`}
                      >
                        {isActive && <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                      </span>
                      <span>{cat.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isCollectionPage && (
          <div>
            <button
              onClick={() => router.push('/search')}
              className="font-cairo text-sm text-gold underline underline-offset-4 transition-all duration-200 hover:text-gold-dark hover:underline-offset-2"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}

        {/* Divider between sections */}
        <div className="my-5 h-px bg-stone/30" />

        {/* Price range filter - shown on all pages */}
        <PriceRangeFilter />

        {/* Clear filters button */}
        <ClearFiltersButton />
      </div>
    </aside>
  );
}

// Mobile category pills + price pills
export function MobileCategoryPills({ currentCollection }: { currentCollection?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCollectionPage = pathname.startsWith('/search/');

  return (
    <div className="w-full overflow-x-auto lg:hidden">
      <div className="flex gap-2 pb-2">
        {/* Category pills - only on /search */}
        {!isCollectionPage &&
          categories.map((cat) => {
            const isActive = currentCollection === cat.handle;
            return (
              <button
                key={cat.handle}
                onClick={() => router.push(`/search/${cat.handle}`)}
                className={`shrink-0 rounded-full border px-4 py-2 font-cairo text-xs transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'border-gold bg-gold text-white shadow-warm'
                    : 'border-stone bg-white text-darkPurple hover:border-gold hover:bg-gold/10 hover:shadow-warm'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

        {/* Price range pills */}
        {priceRanges.map((range) => {
          const isActive = isPriceRangeActive(searchParams, range);
          return (
            <button
              key={range.label}
              onClick={() => router.push(togglePriceRange(searchParams, pathname, range))}
              className={`shrink-0 rounded-full border px-4 py-2 font-cairo text-xs transition-colors ${
                isActive
                  ? 'border-gold bg-gold text-white'
                  : 'border-stone bg-white text-darkPurple hover:border-gold hover:bg-gold/10'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
