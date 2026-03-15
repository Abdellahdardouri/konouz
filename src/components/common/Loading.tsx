'use client';

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded bg-sand ${className}`}
      style={{
        backgroundImage: 'linear-gradient(100deg, #EDE8DE 30%, #F5F2EB 50%, #EDE8DE 70%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s ease-in-out infinite'
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-stone/50 bg-white-warm">
      <Shimmer className="aspect-square w-full !rounded-none" />
      <div className="border-t border-stone/30 p-3 sm:p-4">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="mt-2 h-3 w-1/2" />
        <Shimmer className="mt-3 h-5 w-1/3" />
        <Shimmer className="mt-3 h-8 w-full !rounded-lg" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-8 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
