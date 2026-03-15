'use client';

// react
import { useMemo } from 'react';

// components
import { AddToCart } from '../cart/add-to-cart';

// types
import { Product } from '@/lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { VariantSelector } from './VariantSelector';
export type Combination = {
  id: string;
  availableForSale: boolean;
  price: string;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

const ProductDescription = ({ product }: { product: Product }) => {
  const searchParams = useSearchParams();

  const combinations: Combination[] = useMemo(
    () =>
      product.variants.map((variant) => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        price: variant.price.amount,
        ...variant.selectedOptions.reduce(
          (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
          {}
        )
      })),
    [product.variants]
  );

  // set price of current combination
  const tempSearchParams = new URLSearchParams(searchParams);
  const currentCombinationPrice = combinations.find((comb) => {
    for (const key in comb) {
      if (
        key !== 'id' &&
        key !== 'price' &&
        key !== 'availableForSale' &&
        (!tempSearchParams.get(key) || tempSearchParams.get(key) !== comb[key])
      )
        return false;
    }
    return true;
  })?.price;

  const price = currentCombinationPrice || product.priceRange.minVariantPrice.amount;
  return (
    <div className="sticky top-1 flex flex-col items-start justify-start gap-5 px-6 font-cairo text-darkPurple">
      <h2 className="hidden text-[clamp(26px,18px_+_2vw,36px)] font-bold leading-tight text-veryDarkPurple md:block">
        {product.title}
      </h2>

      {/* Price */}
      <p className="text-[28px] font-semibold text-purple">{Number(price).toFixed(0)} د.م.</p>

      {/* Divider */}
      <div className="h-px w-full bg-stone/40" />

      <VariantSelector options={product.options} combinations={combinations} />

      {/* Description */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-5 w-[3px] rounded-full bg-purple" />
          <p className="text-[22px] font-semibold text-veryDarkPurple">الوصف</p>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml as string }}
          className="font-cairo text-[16px] leading-relaxed text-darkPurple/80"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-stone/40" />

      {/* Add to cart area */}
      <div className="w-full space-y-3">
        <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
        <p className="text-center font-cairo text-[13px] text-warm-gray">
          &#10003; توصيل مجاني خلال 24 ساعة | &#10003; الدفع عند الاستلام
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
