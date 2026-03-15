'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import categories from '@/data/clothing-images.json';

const CategoryHighlights = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full px-4 py-14 md:py-20">
        <div className="mx-auto max-w-[95%] md:max-w-[1100px]">
          {/* Section heading with gold side-line */}
          <m.h2
            className="mb-8 flex items-center justify-end gap-3 font-cairo text-[clamp(24px,18px_+_2vw,36px)] font-semibold text-veryDarkPurple md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            تسوق حسب الفئة
            <span className="inline-block h-[2px] w-[40px] bg-purple" />
          </m.h2>

          {/* Horizontal scroll on mobile, 4-col x 2-row grid on desktop */}
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:grid-rows-2 md:gap-5 md:overflow-visible md:pb-0">
            {categories.map((category, i) => (
              <m.div
                key={i}
                className="w-[240px] flex-shrink-0 md:w-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link
                  href={category.url}
                  className={`group relative block overflow-hidden rounded-xl ring-0 ring-gold/0 transition-all duration-300 hover:ring-2 hover:ring-gold/30 ${
                    i < 4 ? 'aspect-[3/4]' : 'aspect-[4/5]'
                  }`}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 768px) 25vw, 240px"
                    className="duration-600 object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="font-cairo text-[clamp(16px,2.2vw,21px)] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                      {category.title}
                    </span>
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default CategoryHighlights;
