'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

const AboutUs = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full overflow-hidden">
        <h2 className="sr-only">من نحن</h2>
        <div className="flex flex-col-reverse md:min-h-[550px] md:flex-row">
          {/* Text side — RIGHT in RTL (visual left in LTR) */}
          <div className="flex w-full items-center justify-center bg-lightPurple px-8 py-16 md:w-[40%] md:px-12 md:py-24">
            <div className="flex max-w-[440px] flex-col gap-6">
              {/* Heading with gold line */}
              <m.h3
                className="flex items-center gap-3 font-cairo text-[clamp(28px,3vw,44px)] font-semibold text-veryDarkPurple"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                من نحن
                <span className="inline-block h-[2px] w-[40px] bg-purple" />
              </m.h3>
              <m.p
                className="font-cairo text-[clamp(16px,1.5vw,20px)] leading-relaxed text-darkPurple"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                كنوز متجر يهتم بكل ما يفيد البيت من أدوات ومنظمات وأجهزة عملية مختارة بعناية. هدفنا
                تقديم منتجات مفيدة بتجربة تسوق بسيطة وصور واضحة.
              </m.p>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <Link
                  href="/about-us"
                  className="inline-block rounded-[4px] bg-veryDarkPurple px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-semibold text-white transition-all duration-300 hover:border hover:border-purple"
                >
                  اعرف أكثر
                </Link>
              </m.div>
            </div>
          </div>

          {/* Image side — LEFT in RTL (visual right in LTR), reversed from Promotions */}
          <m.div
            className="relative h-[400px] w-full md:h-auto md:w-[60%]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
              alt="أجواء منزلية دافئة"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default AboutUs;
