'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

const words = ['كل', 'ما', 'يحتاجه', 'بيتك'];

const HomeVideo = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative h-[520px] select-none md:h-screen">
        {/* Background video */}
        <video
          playsInline
          muted
          loop
          autoPlay
          preload="auto"
          className="absolute h-full w-full object-cover"
        >
          <source src="/videos/hero-103.mp4" type="video/mp4" />
        </video>

        {/* Darker gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

        {/* Content — centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center md:gap-7">
          <h1 className="font-cairo text-[clamp(32px,6vw,72px)] font-semibold leading-tight text-white drop-shadow-lg">
            {words.map((word, i) => (
              <m.span
                key={i}
                className="ml-3 inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
              >
                {word}
              </m.span>
            ))}
            <br />
            <m.span
              className="inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + words.length * 0.1, ease: 'easeOut' }}
            >
              في مكان واحد
            </m.span>
          </h1>

          <m.p
            className="max-w-[500px] text-center font-cairo text-[clamp(16px,2vw,22px)] font-normal leading-relaxed text-white/90 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
          >
            منتجات عملية وأفكار مفيدة للبيت بتصميم جميل وتسوق سهل
          </m.p>

          <m.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }}
          >
            <Link
              href="/search"
              className="rounded-[4px] bg-purple px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-semibold text-veryDarkPurple transition-all duration-300 hover:shadow-warm-lg hover:brightness-110 hover:scale-105 active:scale-[0.98]"
            >
              تسوق الآن
            </Link>
            <Link
              href="/search/new-arrivals"
              className="hover:bg-white/15 rounded-[4px] border border-white/80 px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-semibold text-white transition-all duration-300 hover:border-white hover:scale-105 active:scale-[0.98]"
            >
              اكتشف الجديد
            </Link>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default HomeVideo;
