'use client';

import Price from '@/components/common/price';
import { DEFAULT_OPTION } from '@/lib/constants';
import type { Cart } from '@/lib/shopify/types';
import { createUrl } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart }: { cart: Cart | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button
        aria-label="افتح السلة"
        onClick={openCart}
        className="transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-full flex-col border-r border-gold/20 bg-white-warm px-4 pb-6 pt-2 text-darkPurple md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="font-cairo text-[28px] font-bold text-veryDarkPurple">سلة التسوق</p>

                <button aria-label="أغلق السلة" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingBagEmpty />
                  <p className="mt-6 text-center font-cairo text-2xl font-bold text-darkPurple">
                    سلتك فارغة
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cart.lines.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li key={i} className="flex w-full flex-col border-b border-gold/30">
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md bg-sand">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage.altText ||
                                    item.merchandise.product.title
                                  }
                                  src={item.merchandise.product.featuredImage.url}
                                />
                              </div>

                              <div className="flex flex-1 flex-col">
                                <span className="font-cairo text-base font-bold leading-tight text-veryDarkPurple">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm font-bold text-purple">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm font-medium"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={item.cost.totalAmount.currencyCode}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-[8px] bg-sand">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 border-x-2 border-gold/50 text-center font-cairo font-bold leading-[1]">
                                  <span className="w-full">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 font-cairo text-sm font-bold">
                    <div className="mb-3 flex items-center justify-between border-b border-gold/30 pb-1">
                      <p>الضريبة</p>
                      <Price
                        className="text-right text-base"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-gold/30 pb-1 pt-1">
                      <p>التوصيل</p>
                      <p className="text-right">مجاني في سيدي قاسم</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-gold/30 pb-1 pt-1">
                      <p>المجموع</p>
                      <Price
                        className="text-right text-base"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                    <p className="mt-1 text-center font-cairo text-xs font-normal text-darkPurple/70">
                      الدفع عند الاستلام متاح
                    </p>
                  </div>
                  <a
                    href="/checkout"
                    className="block w-full rounded-lg bg-veryDarkPurple px-8 py-4 text-center font-cairo font-bold text-white transition-all duration-300 hover:bg-gold hover:text-espresso hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    إتمام الطلب
                  </a>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function ShoppingBagEmpty() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-10 w-10 text-darkPurple"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}
