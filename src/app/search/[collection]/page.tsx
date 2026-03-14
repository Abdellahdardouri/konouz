import { getCollection, getCollectionProducts } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import { defaultSort, sorting } from '@/lib/constants';

export const runtime = 'edge';

const collectionNames: Record<string, string> = {
  kitchen: 'المطبخ',
  organization: 'تنظيم المنزل',
  appliances: 'الأجهزة الصغيرة',
  bathroom: 'الحمام والتنظيف',
  'new-arrivals': 'وصل حديثاً',
  'best-sellers': 'الأكثر طلباً',
  'kitchen-tools': 'أدوات المطبخ',
  cooking: 'التحضير والطبخ',
  organizers: 'علب ومنظمات'
};

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collectionNames[params.collection] || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `منتجات ${collectionNames[params.collection] || collection.title}`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`لا توجد منتجات في هذا القسم`}</p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-[48px]">
          <h2 className="font-cairo text-3xl font-bold text-darkPurple">
            {collectionNames[params.collection] || params.collection}
          </h2>
          <Grid className="grid-cols-1 items-start justify-center sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </div>
      )}
    </section>
  );
}
