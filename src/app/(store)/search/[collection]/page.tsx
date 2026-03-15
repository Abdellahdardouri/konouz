import { getCollection, getCollectionProducts, getProducts } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { MobileCategoryPills } from '@/components/catalog/FilterSidebar';
import SortDropdown from '@/components/catalog/SortDropdown';
import Pagination from '@/components/catalog/Pagination';
import { defaultSort, sorting } from '@/lib/constants';

const collectionNames: Record<string, string> = {
  'tanzim-al-matbakh': 'تنظيم المطبخ',
  'tanzim-al-hammam': 'تنظيم الحمام',
  'takhzin-at-taam': 'تخزين الطعام',
  'adawat-manziliyya': 'أدوات منزلية عملية',
  'tanzim-al-ghasil': 'تنظيم الغسيل',
  'tajfif-al-atbaq': 'تجفيف الأطباق',
  'silal-at-takhzin': 'سلال التخزين',
  'adawat-at-tanzif': 'أدوات التنظيف',
  'new-arrivals': 'وصل حديثاً',
  trending: 'المنتجات الرائجة'
};

const specialCollections = ['new-arrivals', 'trending'];

const PRODUCTS_PER_PAGE = 20;

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const name = collectionNames[params.collection];

  if (specialCollections.includes(params.collection)) {
    return {
      title: name || params.collection,
      description: `منتجات ${name || params.collection}`
    };
  }

  const collection = await getCollection(params.collection);
  if (!collection) return notFound();

  return {
    title: collection.seo?.title || name || collection.title,
    description:
      collection.seo?.description || collection.description || `منتجات ${name || collection.title}`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page, minPrice, maxPrice } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  let products;

  if (params.collection === 'new-arrivals') {
    products = await getProducts({ sortKey: 'CREATED_AT', reverse: true });
  } else if (params.collection === 'trending') {
    products = await getProducts({ sortKey: 'BEST_SELLING' });
  } else {
    products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });
  }

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

  const displayName = collectionNames[params.collection] || params.collection;

  const currentPage = Math.max(1, Number(page) || 1);
  const totalProducts = filteredProducts.length;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <section className="w-full bg-white-warm">
      {products.length === 0 ? (
        <p className="py-3 font-cairo text-lg text-darkPurple">لا توجد منتجات في هذا القسم</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Category heading */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-6 w-[3px] rounded-full bg-purple" />
            <h2 className="font-cairo text-3xl font-bold text-veryDarkPurple">{displayName}</h2>
          </div>

          {/* Mobile price filter pills */}
          <MobileCategoryPills currentCollection={params.collection} />

          <div className="flex w-full gap-6">
            {/* Desktop sidebar (left side visually) */}
            <FilterSidebar currentCollection={params.collection} />

            {/* Main content area */}
            <div className="min-w-0 flex-1">
              {/* Sort bar */}
              <div className="mb-6 flex items-center justify-between">
                <SortDropdown />
                <span className="font-cairo text-sm text-warm-gray">
                  عرض {paginatedProducts.length} من {totalProducts}
                </span>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {paginatedProducts.map((product, i) => (
                  <li key={product.handle} className="transition-opacity">
                    <ProductCard product={product} delay={(i % 4) * 0.15} />
                  </li>
                ))}
              </ul>

              <Pagination totalProducts={totalProducts} productsPerPage={PRODUCTS_PER_PAGE} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
