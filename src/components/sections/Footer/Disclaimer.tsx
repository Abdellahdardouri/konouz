const Disclaimer = async () => {
  return (
    <div className="flex max-w-full flex-col items-center gap-4 md:w-[280px] md:items-start">
      <h3 className="font-cairo text-[18px] font-bold text-white">عن المتجر</h3>
      <p className="text-center font-cairo text-[14px] leading-relaxed text-lightPurple/70 md:text-right">
        كنوز — متجر منتجات البيت في سيدي قاسم. توصيل خلال 24 ساعة والدفع عند الاستلام.
      </p>
    </div>
  );
};

export default Disclaimer;
