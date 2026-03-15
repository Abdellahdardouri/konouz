'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    product: {
      title: string;
      handle: string;
      featuredImage: { url: string; altText?: string };
    };
    title: string;
  };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
};

type CartData = {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
};

type PaymentMethod = 'CASH_ON_DELIVERY' | 'STRIPE';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

const inputClasses =
  'w-full rounded-lg border border-stone/40 bg-white px-4 py-3 font-cairo text-base text-veryDarkPurple outline-none transition-all duration-200 focus:border-purple focus:ring-2 focus:ring-purple/20';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      color: '#1E1C19',
      '::placeholder': { color: '#9A9590' }
    },
    invalid: { color: '#DC2626' }
  },
  hidePostalCode: true
};

function CheckoutForm({
  cart,
  form,
  setForm,
  paymentMethod,
  setPaymentMethod
}: {
  cart: CartData;
  form: { fullName: string; phone: string; address: string; city: string; notes: string };
  setForm: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      phone: string;
      address: string;
      city: string;
      notes: string;
    }>
  >;
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.phone || !form.address) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Create the order
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          paymentMethod,
          customerName: form.fullName,
          customerPhone: form.phone,
          customerAddress: form.address,
          customerCity: form.city,
          notes: form.notes
        })
      });

      const orderJson = await orderRes.json();

      if (!orderJson.success) {
        setError(orderJson.error || 'حدث خطأ أثناء إنشاء الطلب');
        setSubmitting(false);
        return;
      }

      // 2. If COD, we're done
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        setSuccess(true);
        document.cookie = 'cartId=; path=/; max-age=0';
        setSubmitting(false);
        return;
      }

      // 3. If Stripe, create payment intent and confirm
      if (!stripe || !elements) {
        setError('لم يتم تحميل نظام الدفع. يرجى تحديث الصفحة.');
        setSubmitting(false);
        return;
      }

      const orderId = orderJson.data?.id || orderJson.data?.order?.id;

      const intentRes = await fetch(`${API_URL}/payments/stripe/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const intentJson = await intentRes.json();

      if (!intentJson.success || !intentJson.data?.clientSecret) {
        setError(intentJson.error || 'حدث خطأ في إعداد الدفع');
        setSubmitting(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('يرجى إدخال بيانات البطاقة');
        setSubmitting(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentJson.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: form.fullName,
              phone: form.phone
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'فشل الدفع. يرجى المحاولة مرة أخرى.');
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        document.cookie = 'cartId=; path=/; max-age=0';
      }
    } catch {
      setError('حدث خطأ في الاتصال. يرجى المحاولة لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 bg-white-warm px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-4xl text-success">
          &#10003;
        </div>
        <h1 className="font-cairo text-3xl font-bold text-veryDarkPurple">تم تأكيد طلبك!</h1>
        <p className="font-cairo text-lg leading-relaxed text-darkPurple">
          شكراً لطلبك من كنوز. سيصلك طلبك خلال 24 ساعة في سيدي قاسم.
          {paymentMethod === 'CASH_ON_DELIVERY' && (
            <>
              <br />
              الدفع عند الاستلام.
            </>
          )}
          {paymentMethod === 'STRIPE' && (
            <>
              <br />
              تم الدفع بنجاح.
            </>
          )}
        </p>
        <a
          href="/"
          className="rounded-lg bg-espresso px-8 py-3 font-cairo text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-espresso"
        >
          العودة للمتجر
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-warm">
      <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
        <h1 className="mb-10 text-center font-cairo text-3xl font-bold text-veryDarkPurple">
          إتمام الطلب
        </h1>

        <div className="flex flex-col gap-10 md:flex-row-reverse">
          {/* Order Summary */}
          <div className="md:w-[380px]">
            <div className="rounded-2xl border border-stone/30 bg-cream p-6">
              <h2 className="mb-5 font-cairo text-xl font-bold text-veryDarkPurple">ملخص الطلب</h2>
              <div className="flex flex-col gap-4">
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-cairo text-sm font-bold text-veryDarkPurple">
                        {line.merchandise.product.title}
                      </p>
                      <p className="font-cairo text-xs text-warm-gray">الكمية: {line.quantity}</p>
                    </div>
                    <p className="font-cairo text-sm font-semibold text-purple">
                      {Number(line.cost.totalAmount.amount).toFixed(0)} د.م.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-stone/30 pt-5">
                <div className="flex justify-between font-cairo text-sm text-darkPurple">
                  <span>التوصيل</span>
                  <span className="font-bold text-success">مجاني</span>
                </div>
                <div className="mt-3 flex justify-between font-cairo text-lg font-bold text-veryDarkPurple">
                  <span>المجموع</span>
                  <span className="text-purple">
                    {Number(cart.cost.totalAmount.amount).toFixed(0)} د.م.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
            <h2 className="font-cairo text-xl font-bold text-veryDarkPurple">معلومات التوصيل</h2>

            <div>
              <label className="mb-1.5 block font-cairo text-sm font-semibold text-darkPurple">
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputClasses}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-cairo text-sm font-semibold text-darkPurple">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClasses}
                placeholder="06XXXXXXXX"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-cairo text-sm font-semibold text-darkPurple">
                العنوان *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClasses}
                placeholder="الحي، الشارع، رقم المنزل"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-cairo text-sm font-semibold text-darkPurple">
                المدينة
              </label>
              <input
                type="text"
                value={form.city}
                disabled
                className="w-full rounded-lg border border-stone/30 bg-sand px-4 py-3 font-cairo text-base text-darkPurple/60"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-cairo text-sm font-semibold text-darkPurple">
                ملاحظات إضافية
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={inputClasses}
                placeholder="أي تعليمات خاصة للتوصيل..."
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <h2 className="mb-3 font-cairo text-xl font-bold text-veryDarkPurple">طريقة الدفع</h2>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-right transition-all duration-200 ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-purple bg-purple/5 shadow-warm'
                      : 'border-stone/30 bg-white hover:border-gold/50 hover:bg-gold/5 hover:shadow-warm'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      paymentMethod === 'CASH_ON_DELIVERY' ? 'border-purple' : 'border-stone/50'
                    }`}
                  >
                    {paymentMethod === 'CASH_ON_DELIVERY' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-purple" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-6 w-6 text-darkPurple"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                    <div>
                      <p className="font-cairo text-base font-semibold text-veryDarkPurple">
                        الدفع عند الاستلام
                      </p>
                      <p className="font-cairo text-xs text-warm-gray">ادفع نقداً عند وصول الطلب</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-right transition-all duration-200 ${
                    paymentMethod === 'STRIPE'
                      ? 'border-purple bg-purple/5 shadow-warm'
                      : 'border-stone/30 bg-white hover:border-gold/50 hover:bg-gold/5 hover:shadow-warm'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      paymentMethod === 'STRIPE' ? 'border-purple' : 'border-stone/50'
                    }`}
                  >
                    {paymentMethod === 'STRIPE' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-purple" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-6 w-6 text-darkPurple"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <div>
                      <p className="font-cairo text-base font-semibold text-veryDarkPurple">
                        الدفع بالبطاقة
                      </p>
                      <p className="font-cairo text-xs text-warm-gray">Visa, Mastercard, وغيرها</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Stripe Card Input */}
            {paymentMethod === 'STRIPE' && (
              <div className="rounded-xl border border-stone/30 bg-white p-4">
                <label className="mb-3 block font-cairo text-sm font-semibold text-darkPurple">
                  بيانات البطاقة
                </label>
                <div className="rounded-lg border border-stone/40 bg-white px-4 py-3" dir="ltr">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="mt-2 flex items-center gap-1.5 font-cairo text-xs text-warm-gray">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  مدفوعاتك محمية ومشفرة عبر Stripe
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-error/10 p-3 text-center font-cairo text-sm text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || (paymentMethod === 'STRIPE' && !stripe)}
              className="mt-2 w-full rounded-lg bg-espresso px-6 py-4 font-cairo text-xl font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-espresso hover:shadow-warm-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-espresso disabled:hover:text-white disabled:hover:shadow-none disabled:hover:scale-100"
            >
              {submitting
                ? 'جاري المعالجة...'
                : paymentMethod === 'CASH_ON_DELIVERY'
                ? 'تأكيد الطلب — الدفع عند الاستلام'
                : `الدفع الآن — ${Number(cart.cost.totalAmount.amount).toFixed(0)} د.م.`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'سيدي قاسم',
    notes: ''
  });

  useEffect(() => {
    const cartId = getCookie('cartId');
    if (!cartId) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/cart/${cartId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCart(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white-warm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 bg-white-warm px-4 py-16 text-center">
        <p className="font-cairo text-xl text-darkPurple">سلتك فارغة</p>
        <a
          href="/"
          className="rounded-lg bg-espresso px-8 py-3 font-cairo text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-espresso"
        >
          تصفح المنتجات
        </a>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cart={cart}
        form={form}
        setForm={setForm}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </Elements>
  );
}
