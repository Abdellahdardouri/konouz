'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createUrl } from '@/lib/utils';

interface PaginationProps {
  totalProducts: number;
  productsPerPage: number;
}

export default function Pagination({ totalProducts, productsPerPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentPage = Math.min(Math.max(1, Number(searchParams.get('page')) || 1), totalPages);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(createUrl(pathname, params));
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const buttonBase =
    'flex h-10 w-10 items-center justify-center rounded-lg border font-cairo text-sm transition-all duration-200';

  return (
    <nav className="flex items-center justify-center gap-2 pt-8" dir="ltr">
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBase} ${
          currentPage === 1
            ? 'cursor-not-allowed border-stone/50 text-stone'
            : 'border-stone text-darkPurple hover:border-gold hover:bg-gold/10 hover:shadow-warm active:scale-90'
        }`}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center font-cairo text-warm-gray"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`${buttonBase} ${
              page === currentPage
                ? 'border-gold bg-gold text-white'
                : 'border-stone text-darkPurple hover:border-gold hover:bg-gold/10 hover:shadow-warm active:scale-90'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBase} ${
          currentPage === totalPages
            ? 'cursor-not-allowed border-stone/50 text-stone'
            : 'border-stone text-darkPurple hover:border-gold hover:bg-gold/10 hover:shadow-warm active:scale-90'
        }`}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </nav>
  );
}
