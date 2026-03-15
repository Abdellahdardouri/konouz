'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Slider from './Slider';

const collections = [
  'tanzim-al-matbakh',
  'tanzim-al-hammam',
  'takhzin-at-taam',
  'adawat-manziliyya'
] as const;
export type Collection = (typeof collections)[number];

const collectionLabels: Record<Collection, string> = {
  'tanzim-al-matbakh': 'تنظيم المطبخ',
  'tanzim-al-hammam': 'تنظيم الحمام',
  'takhzin-at-taam': 'تخزين الطعام',
  'adawat-manziliyya': 'أدوات منزلية'
};

const BestSellers = () => {
  const [activeCollection, setActiveCollection] = useState<Collection>('tanzim-al-matbakh');
  return (
    <LazyMotion features={domAnimation}>
      <section className="flex w-full flex-col items-center justify-center gap-[24px] pb-[32px] pt-[24px] md:gap-[48px] md:pb-[64px] md:pt-[48px]">
        <m.div
          className="flex w-full max-w-[95%] flex-col items-center justify-center gap-5 font-cairo text-veryDarkPurple md:w-[904px] md:flex-row md:items-end md:justify-between md:gap-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Pill-style filter tabs (right side in RTL) */}
          <div className="order-2 flex flex-wrap justify-center gap-3 text-[clamp(14px,10px_+_1vw,17px)] md:order-1 md:gap-4">
            {collections.map((collection, i) => (
              <button
                key={i}
                className={clsx(
                  'cursor-pointer rounded-full border px-5 py-2 font-cairo font-medium transition-all duration-300 active:scale-[0.96]',
                  {
                    'border-purple bg-purple/10 text-purple shadow-warm':
                      collection === activeCollection,
                    'border-darkPurple/30 text-darkPurple hover:border-purple hover:bg-purple/5 hover:text-purple hover:shadow-warm':
                      collection !== activeCollection
                  }
                )}
                onClick={() => setActiveCollection(collection)}
              >
                {collectionLabels[collection]}
              </button>
            ))}
          </div>

          {/* Section heading (left side in RTL) */}
          <h2 className="order-1 flex items-center gap-3 text-[clamp(28px,20px_+_2vw,40px)] font-semibold md:order-2">
            المنتجات الرائجة
            <span className="inline-block h-[2px] w-[40px] bg-purple" />
          </h2>
        </m.div>
        <div className="relative max-w-full md:w-[904px]">
          <Slider collection={activeCollection} />
        </div>
      </section>
    </LazyMotion>
  );
};

export default BestSellers;
