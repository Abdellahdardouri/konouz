'use client';

import { addItem } from '@/components/cart/actions';
import { ProductVariant } from '@/lib/shopify/types';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import Loading from 'react-loading';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();

  if (!availableForSale) {
    return (
      <button
        aria-disabled
        className="w-full cursor-not-allowed rounded-lg bg-stone px-6 py-4 font-cairo text-[18px] font-semibold text-charcoal opacity-70"
      >
        غير متوفر
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-disabled
        className="w-full cursor-not-allowed rounded-lg bg-stone px-6 py-4 font-cairo text-[18px] font-semibold text-warm-gray opacity-60"
      >
        اختر خياراً
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="أضف إلى السلة"
      aria-disabled={pending}
      className={clsx(
        'w-full rounded-lg bg-espresso px-6 py-4 font-cairo text-[18px] font-semibold text-white transition-all duration-300',
        'hover:bg-gold hover:text-espresso hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98]',
        {
          'cursor-not-allowed opacity-60': pending
        }
      )}
    >
      {pending && (
        <>
          <Loading
            color="white"
            type="spin"
            width="20px"
            height="18px"
            className="inline-block text-[12px]"
          />{' '}
        </>
      )}
      أضف إلى السلة
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);

  return (
    <form action={actionWithVariant}>
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
