// next
import Link from 'next/link';

export const metadata = {
  title: 'من نحن',
  description: 'تعرف على كنوز — متجر منتجات البيت في سيدي قاسم'
};

export default function AboutUsPage() {
  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Header */}
      <section className="flex w-full max-w-[700px] flex-col items-center gap-8 text-center">
        <h1 className="font-cairo text-[clamp(32px,4vw,56px)] font-bold text-veryDarkPurple">
          من نحن
        </h1>
        <p className="font-cairo text-[clamp(18px,2vw,22px)] leading-relaxed text-darkPurple">
          كنوز متجر يهتم بكل ما يفيد البيت من أدوات ومنظمات وأجهزة عملية مختارة بعناية. هدفنا تقديم
          منتجات مفيدة بتجربة تسوق بسيطة وصور واضحة.
        </p>
      </section>

      {/* Divider */}
      <div className="my-12 h-[1px] w-full max-w-[700px] bg-lightPurple" />

      {/* Values */}
      <section className="flex w-full max-w-[700px] flex-col gap-8">
        <h2 className="text-center font-cairo text-[clamp(24px,3vw,36px)] font-semibold text-veryDarkPurple">
          قيمنا
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              className="flex flex-col gap-3 rounded-[16px] bg-lightPurple p-6 text-center"
            >
              <h3 className="font-cairo text-[18px] font-bold text-veryDarkPurple">
                {value.title}
              </h3>
              <p className="font-cairo text-[15px] leading-relaxed text-darkPurple">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="my-12 h-[1px] w-full max-w-[700px] bg-lightPurple" />

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="font-cairo text-[clamp(18px,2vw,22px)] text-darkPurple">
          اكتشف مجموعتنا المختارة من منتجات البيت
        </p>
        <Link href="/search" className="btn-very-dark text-[clamp(18px,2vw,22px)]">
          تسوق الآن
        </Link>
      </section>
    </main>
  );
}
