'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { A11y, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Product } from '@/lib/shopify/types';

const ProductSlider = ({ product }: { product: Product }) => {
  const mainSwiper = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(product.images.length <= 1);

  return (
    <div className="sticky top-4">
      {/* Mobile title */}
      <div className="mb-4 md:hidden">
        <h2 className="font-cairo text-[clamp(22px,5vw,32px)] font-bold text-darkPurple">
          {product.title}
        </h2>
      </div>

      {/* Gallery: thumbnails LEFT + main image RIGHT — forced LTR */}
      <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4" dir="ltr">
        {/* Thumbnail strip */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-1 md:max-h-[520px] md:flex-col md:overflow-y-auto md:overflow-x-visible md:pb-0">
          {product.images.map((image, i) => (
            <button
              key={i}
              onClick={() => {
                mainSwiper.current?.slideTo(i);
                setActiveIndex(i);
              }}
              className={clsx(
                'relative h-[72px] w-[58px] flex-shrink-0 overflow-hidden rounded-[8px] border-2 transition-all duration-200',
                activeIndex === i
                  ? 'border-veryDarkPurple'
                  : 'border-transparent hover:border-purple'
              )}
            >
              <Image
                src={image.url || ''}
                alt={`${product.title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="58px"
                unoptimized
              />
            </button>
          ))}
        </div>

        {/* Main image swiper */}
        <div
          className="relative flex-1 overflow-hidden rounded-[16px]"
          style={{ aspectRatio: '4/5' }}
        >
          <Swiper
            modules={[A11y, Thumbs]}
            onSwiper={(s) => {
              mainSwiper.current = s;
            }}
            onSlideChange={(s) => {
              setActiveIndex(s.activeIndex);
              setIsStart(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
            className="h-full w-full rounded-[16px]"
          >
            {product.images.map((image, i) => (
              <SwiperSlide key={i} className="relative h-full w-full">
                <Image
                  src={image.url || ''}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 45vw, 100vw"
                  priority={i === 0}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev arrow */}
          {!isStart && (
            <button
              className="absolute left-2 top-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md transition -translate-y-1/2 hover:bg-white hover:scale-110"
              onClick={() => mainSwiper.current?.slidePrev()}
              aria-label="Previous"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {!isEnd && (
            <button
              className="absolute right-2 top-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md transition -translate-y-1/2 hover:bg-white hover:scale-110"
              onClick={() => mainSwiper.current?.slideNext()}
              aria-label="Next"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
