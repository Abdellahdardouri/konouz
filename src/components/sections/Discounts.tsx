'use client';

// react-fast-marquee
import Marquee from 'react-fast-marquee';

const Discounts = () => {
  return (
    <div className="bg-veryDarkPurple px-[4px] py-[3px] font-cairo font-medium text-white md:px-[8px] md:py-[6px] md:text-[18px]">
      <Marquee autoFill={true} direction="right">
        <div className="ml-[32px] flex items-center justify-center gap-[32px]">
          <p>توصيل مجاني في سيدي قاسم خلال 24 ساعة</p>
          <div className="aspect-square w-[8px] rounded-full bg-purple" />
          <p>الدفع عند الاستلام</p>
          <div className="aspect-square w-[8px] rounded-full bg-purple" />
          <p>منتجات مختارة بعناية</p>
          <div className="aspect-square w-[8px] rounded-full bg-purple" />
          <p>كنوز — متجرك للبيت</p>
          <div className="aspect-square w-[8px] rounded-full bg-purple" />
        </div>
      </Marquee>
    </div>
  );
};

export default Discounts;
