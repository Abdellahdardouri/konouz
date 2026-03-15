import { ProductCardSkeleton, Shimmer } from '@/components/common/Loading';

export default function Loading() {
  return (
    <div className="flex w-full gap-0">
      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Shimmer className="h-10 w-[140px] !rounded-lg" />
          <Shimmer className="h-5 w-[100px]" />
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden w-[260px] min-w-[260px] border-l border-stone/30 p-5 lg:block">
        <div className="space-y-4">
          <Shimmer className="h-6 w-[60px]" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
