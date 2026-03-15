import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { MobileCategoryPills } from '@/components/catalog/FilterSidebar';
import SortDropdown from '@/components/catalog/SortDropdown';
import Pagination from '@/components/catalog/Pagination';
import { defaultSort, sorting } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';

export const metadata = {
  title: 'البحث',
  description: 'ابحث عن منتجات كنوز'
};

const PRODUCTS_PER_PAGE = 20;

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const {
    sort,
    q: searchValue,
    page,
    minPrice,
    maxPrice
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  // Apply price range filtering
  let filteredProducts = products;
  if (minPrice || maxPrice) {
    const mins = minPrice ? minPrice.split(',').map(Number) : [];
    const maxes = maxPrice ? maxPrice.split(',') : [];
    filteredProducts = products.filter((p) => {
      const price = Number(p.priceRange.minVariantPrice.amount);
      return mins.some((min, i) => {
        const max = maxes[i] === 'Infinity' ? Infinity : Number(maxes[i]);
        return price >= min && price <= max;
      });
    });
  }

  const currentPage = Math.max(1, Number(page) || 1);
  const totalProducts = filteredProducts.length;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const resultsText = totalProducts > 1 ? 'نتائج' : 'نتيجة';

  return (
    <>
      {searchValue ? (
        <p className="w-full font-cairo text-darkPurple">
          {totalProducts === 0
            ? 'لا توجد منتجات تطابق '
            : `تم إيجاد ${totalProducts} ${resultsText} لـ `}
          <span className="font-bold text-veryDarkPurple">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {/* Mobile category pills */}
      <MobileCategoryPills />

      <div className="flex w-full gap-6">
        {/* Desktop sidebar (left side visually) */}
        <FilterSidebar />

        {/* Main content area */}
        <div className="min-w-0 flex-1">
          {/* Sort bar */}
          <div className="mb-6 flex items-center justify-between">
            <SortDropdown />
            <span className="font-cairo text-sm text-warm-gray">
              عرض {paginatedProducts.length} من {totalProducts}
            </span>
          </div>

          {paginatedProducts.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {paginatedProducts.map((product, i) => (
                <li key={product.handle} className="transition-opacity">
                  <ProductCard product={product} delay={(i % 4) * 0.15} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center font-cairo text-darkPurple">لا توجد منتجات</p>
          )}

          <Pagination totalProducts={totalProducts} productsPerPage={PRODUCTS_PER_PAGE} />
        </div>
      </div>
    </>
  );
}
