'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

const trustPoints = [
  {
    title: 'توصيل مجاني في سيدي قاسم',
    subtitle: 'خلال 24 ساعة إلى باب منزلك',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple"
      >
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    title: 'الدفع عند الاستلام',
    subtitle: 'ادفع فقط عند استلام طلبك',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    )
  },
  {
    title: 'منتجات مختارة بعناية',
    subtitle: 'معايير صارمة للجودة والعملية',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
];

const TrustBlock = () => {
  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full bg-veryLightPurple py-10 md:py-14">
        <m.div
          className="scrollbar-hide mx-auto flex max-w-[95%] items-stretch gap-0 overflow-x-auto md:max-w-[960px] md:overflow-visible"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {trustPoints.map((point, i) => (
            <div key={i} className="flex flex-1 items-center">
              {/* Trust item */}
              <div className="flex min-w-[220px] flex-1 flex-col items-center gap-3 px-6 py-4 text-center md:min-w-0">
                <div className="mb-1">{point.icon}</div>
                <h3 className="font-cairo text-[16px] font-semibold text-veryDarkPurple md:text-[18px]">
                  {point.title}
                </h3>
                <p className="font-cairo text-[14px] text-darkPurple/70">{point.subtitle}</p>
              </div>
              {/* Vertical divider — not after last item */}
              {i < trustPoints.length - 1 && (
                <div className="h-[60px] w-[1px] flex-shrink-0 bg-darkPurple/20" />
              )}
            </div>
          ))}
        </m.div>
      </section>
    </LazyMotion>
  );
};

export default TrustBlock;
