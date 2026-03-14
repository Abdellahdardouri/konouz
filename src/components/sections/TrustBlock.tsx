const trustPoints = [
  {
    icon: '✓',
    title: 'توصيل مجاني في سيدي قاسم',
    description: 'نوصل طلبك مجاناً خلال 24 ساعة مباشرة إلى باب منزلك في سيدي قاسم'
  },
  {
    icon: '✓',
    title: 'الدفع عند الاستلام',
    description: 'لا حاجة للدفع مسبقاً، ادفع فقط عند استلام طلبك بكل أمان وراحة'
  },
  {
    icon: '✓',
    title: 'منتجات مختارة بعناية',
    description: 'كل منتج في كنوز يمر بمعايير اختيار صارمة للجودة والعملية'
  }
];

const TrustBlock = () => {
  return (
    <section className="flex w-full items-center justify-center bg-veryLightPurple py-10 md:py-14">
      <div className="flex w-full max-w-[95%] flex-col items-stretch gap-6 md:max-w-[904px] md:flex-row md:gap-8">
        {trustPoints.map((point, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-3 rounded-[16px] bg-white p-6 text-center shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lightPurple text-[28px] text-purple">
              {point.icon}
            </div>
            <h3 className="font-cairo text-[18px] font-bold text-veryDarkPurple">{point.title}</h3>
            <p className="font-cairo text-[15px] leading-relaxed text-darkPurple">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBlock;
