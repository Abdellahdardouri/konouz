'use client';

// next
import Image from 'next/image';

// react
import { useRef, useState } from 'react';

// framer motion
import { LazyMotion, domAnimation, m } from 'framer-motion';

// clsx
import clsx from 'clsx';

// types
import { Product } from '@/lib/shopify/types';

const ProductCard = ({
  product,
  rank,
  delay = 0,
  duration = 0.5
}: {
  product: Product;
  rank?: number;
  delay?: number;
  duration?: number;
}) => {
  const [activeImage, setActiveImage] = useState('main');
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const isNew = product.tags.includes('new');
  const isBestSeller = product.tags.includes('trending');

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        className="relative flex w-[180px] flex-col items-center justify-center gap-[10px] sm:w-[280px]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeOut', duration, delay }}
        viewport={{ once: true }}
      >
        <a
          href={'/product/' + product.handle}
          onMouseEnter={() => {
            setActiveImage('hover');
            clearTimeout(timeoutId.current);
          }}
          onMouseLeave={() => setActiveImage('main')}
        >
          <div className="relative aspect-[7/10] h-[257px] overflow-hidden rounded-[16px] sm:h-[400px]">
            {/* Rank badge */}
            {rank !== undefined && (
              <div className="absolute right-0 top-0 z-10 flex aspect-square w-[20%] max-w-[56px] items-center justify-center rounded-bl-[16px] bg-white/50 font-cairo text-[clamp(16px,4px_+_2vw,24px)] font-bold text-veryDarkPurple/70 backdrop-blur-sm">
                {rank}
              </div>
            )}
            {/* New badge */}
            {isNew && !rank && (
              <div className="absolute right-0 top-0 z-10 rounded-bl-[16px] bg-purple px-3 py-1 font-cairo text-[12px] font-bold text-white">
                جديد
              </div>
            )}
            {/* Best seller badge */}
            {isBestSeller && !rank && !isNew && (
              <div className="absolute right-0 top-0 z-10 rounded-bl-[16px] bg-veryDarkPurple px-3 py-1 font-cairo text-[12px] font-bold text-white">
                رائج
              </div>
            )}
            <Image
              src={product.images[0]?.url || ''}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 280px, 180px"
              className={clsx('object-cover transition-all duration-500 will-change-transform', {
                'opacity-0': activeImage !== 'main',
                'opacity-100': activeImage === 'main'
              })}
              unoptimized
            />
            <Image
              src={product.images[1]?.url || product.images[0]?.url || ''}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 280px, 180px"
              className={clsx('object-cover transition-all duration-500 will-change-transform', {
                'opacity-0': activeImage !== 'hover',
                'opacity-100': activeImage === 'hover'
              })}
              unoptimized
            />
          </div>
        </a>
        <a href={'/product/' + product.handle}>
          <h3 className="text-center font-cairo text-[clamp(16px,8px_+_2vw,20px)] font-bold text-darkPurple transition-all duration-300 hover:text-purple">
            {product.title}
          </h3>
        </a>
        <p className="font-cairo text-[clamp(18px,8px_+_2vw,22px)] font-semibold text-veryDarkPurple">
          {Number(product.priceRange.minVariantPrice.amount).toFixed(0)} د.م.
        </p>
      </m.article>
    </LazyMotion>
  );
};

export default ProductCard;
