// next
import Link from 'next/link';

export const metadata = {
  title: 'من نحن',
  description: 'تعرف على كنوز — متجر منتجات البيت في سيدي قاسم'
};

export default function AboutUsPage() {
  return (
    <main className="flex w-full flex-col items-center">
      {/* Full-bleed lifestyle hero */}
      <section className="relative flex min-h-[50vh] w-full items-center justify-center bg-veryDarkPurple">
        <div className="absolute inset-0 bg-gradient-to-b from-veryDarkPurple/80 to-veryDarkPurple" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-24 text-center">
          <span className="select-none font-cairo text-[64px] font-bold leading-none text-purple">
            ك
          </span>
          <h1 className="font-cairo text-[clamp(32px,5vw,56px)] font-bold text-white">من نحن</h1>
          <p className="max-w-[600px] font-cairo text-[clamp(16px,2vw,20px)] leading-relaxed text-lightPurple/80">
            كنوز متجر يهتم بكل ما يفيد البيت من أدوات ومنظمات وأجهزة عملية مختارة بعناية. هدفنا
            تقديم منتجات مفيدة بتجربة تسوق بسيطة وصور واضحة.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="w-full bg-sand">
        <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center gap-6 px-4 py-10 md:flex-row md:gap-16">
          {[
            { value: '+200', label: 'منتج' },
            { value: '24', label: 'ساعة توصيل' },
            { value: 'سيدي قاسم', label: 'المدينة' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="font-cairo text-[28px] font-bold text-purple">{stat.value}</span>
              <span className="font-cairo text-[15px] text-darkPurple">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="w-full bg-white-warm px-4 py-16 md:py-24">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-10">
          <h2 className="text-center font-cairo text-[clamp(24px,3vw,36px)] font-semibold text-veryDarkPurple">
            قيمنا
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: 'الجودة أولاً',
                body: 'نختار كل منتج بعناية لضمان أعلى مستوى من الجودة والمتانة'
              },
              {
                title: 'البساطة والعملية',
                body: 'منتجات تحل مشاكل حقيقية في البيت وتجعل يومك أسهل وأكثر راحة'
              },
              {
                title: 'توصيل سريع وآمن',
                body: 'توصيل مجاني في سيدي قاسم خلال 24 ساعة مع إمكانية الدفع عند الاستلام — ادفع لما توصلك'
              }
            ].map((value, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-stone/20 bg-cream p-8 text-center transition-shadow duration-300 hover:shadow-warm"
              >
                <h3 className="font-cairo text-[18px] font-bold text-veryDarkPurple">
                  {value.title}
                </h3>
                <p className="font-cairo text-[15px] leading-relaxed text-darkPurple/80">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-sand px-4 py-16">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-6 text-center">
          <p className="font-cairo text-[clamp(18px,2vw,22px)] text-darkPurple">
            اكتشف مجموعتنا المختارة من منتجات البيت
          </p>
          <Link
            href="/search"
            className="rounded-lg bg-espresso px-10 py-4 font-cairo text-[clamp(16px,2vw,20px)] font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-espresso"
          >
            تسوق الآن
          </Link>
        </div>
      </section>
    </main>
  );
}
