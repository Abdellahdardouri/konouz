// next
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// react
import { Suspense } from 'react';

// shopify
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { getProduct } from '@/lib/shopify';

// components
import ProductDescription from '@/components/product/ProductDescription';
import ProductSlider from '@/components/product/ProductSlider';
import RecommendedItems from '@/components/product/RecommendedItems';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

const ProductPage = async ({ params }: { params: { handle: string } }) => {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <section className="flex w-full flex-col items-center justify-center bg-white-warm py-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 w-full max-w-[95%] md:w-[1000px]" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 font-cairo text-[14px] text-warm-gray">
            <li>
              <Link href="/" className="transition-colors hover:text-purple">
                الرئيسية
              </Link>
            </li>
            <li className="text-stone">/</li>
            <li>
              <Link href="/search" className="transition-colors hover:text-purple">
                المنتجات
              </Link>
            </li>
            <li className="text-stone">/</li>
            <li className="truncate text-darkPurple">{product.title}</li>
          </ol>
        </nav>

        <h2 className="sr-only">معلومات المنتج</h2>
        <article className="flex w-full max-w-[95%] flex-col items-stretch justify-center gap-6 md:w-[1000px] md:flex-row md:gap-10">
          <div className="max-w-[450px] md:w-1/2">
            <ProductSlider product={product} />
          </div>
          <div className="md:w-1/2">
            <ProductDescription product={product} />
          </div>
        </article>
        <Suspense>
          <RecommendedItems productId={product.handle} />
        </Suspense>
      </section>
    </>
  );
};

export default ProductPage;
