const AboutUs = () => {
  return (
    <section className="flex items-center justify-center border-t-[1px] border-purple bg-lightPurple py-[48px] md:py-[64px]">
      <h2 className="sr-only">من نحن</h2>
      <div className="flex max-w-[95%] flex-col items-center justify-center gap-[32px] text-center md:max-w-[700px]">
        <h3 className="font-cairo text-[clamp(28px,18px_+_2vw,40px)] font-semibold text-veryDarkPurple">
          من نحن
        </h3>
        <p className="max-w-[90%] font-cairo text-[clamp(18px,14px_+_1vw,22px)] font-medium leading-relaxed text-darkPurple md:max-w-none">
          كنوز متجر يهتم بكل ما يفيد البيت من أدوات ومنظمات وأجهزة عملية مختارة بعناية. هدفنا تقديم
          منتجات مفيدة بتجربة تسوق بسيطة وصور واضحة.
        </p>
        <a href="/about-us" className="btn-very-dark mt-2 text-[clamp(18px,10px_+_2vw,22px)]">
          اعرف أكثر
        </a>
      </div>
    </section>
  );
};

export default AboutUs;
