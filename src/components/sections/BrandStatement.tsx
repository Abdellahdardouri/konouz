'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

const BrandStatement = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-veryLightPurple py-32 md:py-40">
        {/* Subtle watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-cairo text-[300px] font-bold text-veryDarkPurple opacity-[0.03] md:text-[500px]"
          aria-hidden="true"
        >
          ك
        </div>

        {/* Main text */}
        <m.p
          className="relative z-10 max-w-[90%] text-center font-cairo text-[clamp(28px,4vw,52px)] font-medium leading-relaxed text-veryDarkPurple md:max-w-[700px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          كل ما يحتاجه بيتك في مكان واحد
        </m.p>
      </section>
    </LazyMotion>
  );
};

export default BrandStatement;
