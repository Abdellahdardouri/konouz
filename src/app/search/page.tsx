import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import FilterList from '@/components/layout/search/filter';
import { defaultSort, sorting } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';

export const metadata = {
  title: 'البحث',
  description: 'ابحث عن منتجات كنوز'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'نتائج' : 'نتيجة';

  return (
    <>
      {searchValue ? (
        <p>
          {products.length === 0
            ? 'لا توجد منتجات تطابق '
            : `تم إيجاد ${products.length} ${resultsText} لـ `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      <div className="flex-none">
        <FilterList list={sorting} title="ترتيب حسب" />
      </div>

      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
