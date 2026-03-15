import { ShoppingCart } from 'lucide-react';

export default function OpenCart({ quantity }: { quantity?: number }) {
  return (
    <div className="relative text-white transition-colors duration-300 hover:text-gold">
      <ShoppingCart size={22} strokeWidth={1.5} />
      {quantity ? (
        <div className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium leading-none text-espresso">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
