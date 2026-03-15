'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

const Promotions = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full overflow-hidden">
        <h2 className="sr-only">عروض كنوز</h2>
        <div className="flex flex-col md:min-h-[600px] md:flex-row">
          {/* Image side — 60% on desktop, full width stacked on mobile */}
          <m.div
            className="relative h-[400px] w-full md:h-auto md:w-[60%]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg"
              alt="منتجات منزلية مختارة"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </m.div>

          {/* Text side — 40% on desktop */}
          <div className="flex w-full items-center justify-center bg-lightPurple px-8 py-16 md:w-[40%] md:px-12 md:py-24">
            <div className="flex max-w-[440px] flex-col gap-6">
              <m.h3
                className="font-cairo text-[clamp(28px,3vw,44px)] font-semibold leading-tight text-veryDarkPurple"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                اختيارات عملية
                <br />
                للبيت
              </m.h3>
              <m.p
                className="font-cairo text-[clamp(16px,1.5vw,20px)] leading-relaxed text-darkPurple"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                منتجات تساعدك في تنظيم المنزل وتوفر راحة يومية أكثر
              </m.p>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <Link
                  href="/search"
                  className="inline-block rounded-[4px] bg-purple px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-semibold text-veryDarkPurple transition-all duration-300 hover:shadow-warm-lg hover:brightness-110 hover:scale-105 active:scale-[0.98]"
                >
                  تصفح المجموعة
                </Link>
              </m.div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default Promotions;
