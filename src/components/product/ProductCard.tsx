'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import clsx from 'clsx';
import { Check, Star, Loader2 } from 'lucide-react';
import { Product } from '@/lib/shopify/types';
import { addItem } from '@/components/cart/actions';

const ProductCard = ({
  product,
  delay = 0,
  className
}: {
  product: Product;
  rank?: number;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState('main');
  const [isPending, startTransition] = useTransition();
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const defaultVariantId = product.variants?.[0]?.id;

  const isNew = product.tags.includes('new');
  const isBestSeller = product.tags.includes('trending');

  const minPrice = Number(product.priceRange.minVariantPrice.amount);
  const maxPrice = Number(product.priceRange.maxVariantPrice.amount);
  const hasDiscount = maxPrice > minPrice;
  const discountPercent = hasDiscount ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0;

  // Generate consistent rating from product handle
  const hashCode = product.handle.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = 3.5 + (hashCode % 15) / 10; // Range: 3.5 to 5.0
  const reviewCount = 10 + (hashCode % 90); // Range: 10 to 99

  return (
    <article
      className={clsx(
        'duration-250 group relative flex flex-col overflow-hidden rounded-[10px] border border-stone bg-white-warm transition-all hover:border-gold hover:shadow-warm-md hover:translate-y-[-2px]',
        className || 'w-full'
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <a
        href={'/product/' + product.handle}
        className="block w-full"
        onMouseEnter={() => {
          setActiveImage('hover');
          clearTimeout(timeoutId.current);
        }}
        onMouseLeave={() => setActiveImage('main')}
      >
        {/* Image section */}
        <div className="relative aspect-square w-full overflow-hidden">
          {isNew && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-veryDarkPurple px-2.5 py-1 font-cairo text-[11px] font-semibold tracking-wide text-purple">
              جديد
            </div>
          )}
          {isBestSeller && !isNew && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-veryDarkPurple px-2.5 py-1 font-cairo text-[11px] font-semibold tracking-wide text-purple">
              رائج
            </div>
          )}

          <Image
            src={product.images[0]?.url || ''}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 280px, 180px"
            className={clsx(
              'object-cover transition-all duration-[600ms] ease-out will-change-transform group-hover:scale-105',
              {
                'opacity-0': activeImage !== 'main',
                'opacity-100': activeImage === 'main'
              }
            )}
            unoptimized
          />
          <Image
            src={product.images[1]?.url || product.images[0]?.url || ''}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 280px, 180px"
            className={clsx(
              'object-cover transition-all duration-[600ms] ease-out will-change-transform group-hover:scale-105',
              {
                'opacity-0': activeImage !== 'hover',
                'opacity-100': activeImage === 'hover'
              }
            )}
            unoptimized
          />
        </div>

        {/* Text section */}
        <div className="border-t border-stone/30 bg-cream px-2.5 py-2 sm:p-4">
          <h3 className="line-clamp-2 font-cairo text-[13px] font-medium leading-snug text-darkPurple sm:text-[15px]">
            {product.title}
          </h3>

          {/* Star rating */}
          <div className="mt-1.5 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={star <= Math.round(rating) ? 'text-gold' : 'text-stone'}
                {...(star <= Math.round(rating) ? { fill: 'currentColor' } : {})}
              />
            ))}
            <span className="mr-1 font-cairo text-xs text-warm-gray">({reviewCount})</span>
          </div>

          <div className="mt-2">
            <span className="font-cairo text-lg font-semibold text-purple">
              {minPrice.toFixed(0)} د.م.
            </span>
            {hasDiscount && (
              <span className="mr-2 inline-flex items-center gap-1">
                <span className="font-cairo text-xs text-warm-gray line-through">
                  {maxPrice.toFixed(0)} د.م.
                </span>
                <span className="rounded bg-success/10 px-1.5 py-0.5 font-cairo text-[11px] font-medium text-success">
                  -{discountPercent}%
                </span>
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-success">
            <Check size={14} strokeWidth={1.5} />
            <span className="font-cairo text-[11px]">توصيل مجاني</span>
          </div>
        </div>
      </a>

      {/* Add to cart button - outside the <a> to avoid invalid HTML nesting */}
      <div className="bg-cream px-2.5 pb-2.5 sm:px-4 sm:pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!defaultVariantId || isPending) return;
            startTransition(async () => {
              await addItem(null, defaultVariantId);
            });
          }}
          disabled={isPending || !defaultVariantId}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold bg-espresso py-2 font-cairo text-sm font-medium text-white transition-all duration-200 hover:bg-gold hover:text-espresso hover:shadow-warm hover:scale-[1.03] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الإضافة...
            </>
          ) : (
            'أضف للسلة'
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
