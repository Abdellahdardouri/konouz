'use client';

// react
import { useState } from 'react';

// clsx
import clsx from 'clsx';

// components
import Slider from './Slider';

// types
const collections = ['kitchen', 'organization', 'appliances', 'bathroom'] as const;
export type Collection = (typeof collections)[number];

const collectionLabels: Record<Collection, string> = {
  kitchen: 'المطبخ',
  organization: 'تنظيم المنزل',
  appliances: 'الأجهزة الصغيرة',
  bathroom: 'الحمام'
};

const BestSellers = () => {
  const [activeCollection, setActiveCollection] = useState<Collection>('kitchen');
  return (
    <section className="flex w-full flex-col items-center justify-center gap-[24px] pb-[32px] pt-[24px] md:gap-[48px] md:pb-[64px] md:pt-[48px]">
      <div className="flex w-full max-w-[95%] flex-col items-center justify-center gap-2 font-cairo font-medium text-veryDarkPurple md:w-[904px] md:flex-row md:justify-between md:gap-0">
        <h2 className="text-[clamp(28px,20px_+_2vw,40px)]">المنتجات الرائجة</h2>
        <div className="flex flex-wrap justify-center gap-4 text-[clamp(16px,10px_+_1.5vw,22px)] md:gap-6">
          {collections.map((collection, i) => (
            <button
              key={i}
              className={clsx(
                'relative cursor-pointer leading-[2] transition-all duration-300 before:absolute before:bottom-0 before:left-1/2 before:h-[4px] before:bg-purple before:transition-all before:duration-300 before:-translate-x-1/2 hover:text-purple hover:before:w-full hover:before:opacity-100',
                {
                  'before:w-full before:opacity-100': collection === activeCollection,
                  'before:w-0 before:opacity-0': collection !== activeCollection
                }
              )}
              onClick={() => setActiveCollection(collection)}
            >
              {collectionLabels[collection]}
            </button>
          ))}
        </div>
      </div>
      <div className="relative max-w-full md:w-[904px]">
        <Slider collection={activeCollection} />
      </div>
    </section>
  );
};

export default BestSellers;
