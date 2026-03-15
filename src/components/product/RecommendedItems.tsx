// shopify
import { getProductRecommendations } from '@/lib/shopify';

// components
import ProductCard from '@/components/product/ProductCard';

const RecommendedItems = async ({ productId }: { productId: string }) => {
  const products = await getProductRecommendations(productId);
  return (
    <div className="flex w-full items-center justify-center py-16">
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-10 px-4 md:px-8">
        {/* Section heading with gold side-line */}
        <div className="flex w-full items-center gap-3">
          <div className="h-6 w-[3px] rounded-full bg-purple" />
          <h2 className="font-cairo text-[clamp(24px,18px_+_2vw,32px)] font-semibold text-veryDarkPurple">
            قد يعجبك أيضاً
          </h2>
        </div>

        {/* Responsive grid */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedItems;
