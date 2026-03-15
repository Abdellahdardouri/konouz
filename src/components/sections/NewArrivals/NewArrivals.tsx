// shopify
import { getProducts } from '@/lib/shopify';

// components
import ProductList from './ProductList';

const NewArrivals = async () => {
  const products = await getProducts({ sortKey: 'CREATED_AT', reverse: true, first: 6 });
  return (
    <section className="flex w-full items-center justify-center pb-[48px] pt-[24px] md:pt-[48px]">
      <div className="flex flex-col items-center justify-center gap-[24px] sm:max-w-[95%] md:w-[904px] md:gap-[48px]">
        {/* Section heading with gold side-line and product count */}
        <div className="flex w-full items-center justify-between px-4 sm:px-0">
          <h2 className="flex items-center gap-3 font-cairo text-[clamp(28px,20px_+_2vw,40px)] font-semibold text-veryDarkPurple">
            وصل حديثاً
            <span className="inline-block h-[2px] w-[40px] bg-purple" />
          </h2>
          <span className="font-cairo text-[15px] text-darkPurple/60">{products.length} منتج</span>
        </div>
        <ProductList products={products} />
        <a
          href="/search/new-arrivals"
          className="rounded-[4px] border border-transparent bg-veryDarkPurple px-10 py-4 font-cairo text-[clamp(16px,10px_+_1.5vw,20px)] font-semibold text-white transition-all duration-300 hover:border-purple hover:bg-gold hover:text-espresso hover:shadow-warm-md hover:scale-105 active:scale-[0.98]"
        >
          عرض المزيد
        </a>
      </div>
    </section>
  );
};

export default NewArrivals;
