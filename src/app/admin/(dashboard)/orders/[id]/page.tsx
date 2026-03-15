'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAdminOrder, updateOrderStatus } from '@/lib/admin-api';
import {
  ArrowRight,
  Loader2,
  Package,
  User,
  CreditCard,
  Calendar,
  ChevronDown,
  Check,
  X,
  MapPin,
  Phone,
  Hash
} from 'lucide-react';

// ---------- Types ----------
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderImage {
  id: string;
  url: string;
}

interface OrderProduct {
  id: string;
  title: string;
  images?: OrderImage[];
}

interface OrderItem {
  id: string;
  quantity: number;
  priceMAD: number;
  product?: OrderProduct;
}

interface ShippingAddress {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

interface Payment {
  method?: string;
  status?: string;
  stripePaymentId?: string;
  amountMAD?: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCity?: string;
  customerAddress?: string;
  notes?: string;
  status: OrderStatus;
  // Direct fields (legacy)
  paymentMethod?: string;
  paymentStatus?: string;
  stripePaymentId?: string;
  // Nested payment object (from API)
  payment?: Payment;
  subtotalMAD?: number;
  discountMAD?: number;
  shippingMAD?: number;
  totalMAD: number;
  promoCode?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

// ---------- Constants ----------
const statusLabels: Record<string, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  PROCESSING: 'قيد التحضير',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
  REFUNDED: 'مسترجع'
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
  SHIPPED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200'
};

const paymentLabels: Record<string, string> = {
  STRIPE: 'بطاقة',
  CASH_ON_DELIVERY: 'نقداً عند الاستلام'
};

const paymentStatusLabels: Record<string, string> = {
  PAID: 'مدفوع',
  UNPAID: 'غير مدفوع',
  REFUNDED: 'مسترجع',
  PENDING: 'في الانتظار'
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

// ---------- Helpers ----------
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ---------- Toast Component ----------
function Toast({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed left-4 top-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 font-cairo text-sm font-medium shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-success text-white' : 'bg-error text-white'
      }`}
    >
      {type === 'success' ? (
        <Check className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <X className="h-4 w-4" strokeWidth={1.5} />
      )}
      {message}
      <button onClick={onClose} className="mr-2 opacity-70 hover:opacity-100">
        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

// ---------- Status Dropdown ----------
function StatusDropdown({
  currentStatus,
  onUpdate,
  updating
}: {
  currentStatus: OrderStatus;
  onUpdate: (status: OrderStatus) => void;
  updating: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-cairo text-sm font-medium transition-all ${
          statusColors[currentStatus] || 'border-gray-200 bg-gray-100 text-gray-800'
        } ${updating ? 'opacity-60' : 'hover:shadow-sm'}`}
      >
        {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} /> : null}
        {statusLabels[currentStatus] || currentStatus}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-stone/30 bg-white py-1 shadow-lg">
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => {
                  if (status !== currentStatus) {
                    onUpdate(status);
                  }
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 font-cairo text-sm transition-colors hover:bg-cream/60 ${
                  status === currentStatus ? 'font-medium text-gold' : 'text-charcoal'
                }`}
              >
                <span>{statusLabels[status]}</span>
                {status === currentStatus && (
                  <Check className="h-4 w-4 text-gold" strokeWidth={1.5} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Main Component ----------
export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrder(orderId);
      // Handle response shape: might be { order: {...} } or direct object
      setOrder(data.order || data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('فشل في تحميل بيانات الطلب');
    }
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  async function handleStatusUpdate(newStatus: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      const result = await updateOrderStatus(order.id, newStatus);
      const updated = result.order || result;
      setOrder((prev) => (prev ? { ...prev, ...updated, status: newStatus } : prev));
      setToast({ message: 'تم تحديث حالة الطلب بنجاح', type: 'success' });
    } catch (err) {
      console.error('Failed to update status:', err);
      setToast({
        message: err instanceof Error ? err.message : 'فشل في تحديث الحالة',
        type: 'error'
      });
    }
    setUpdating(false);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" strokeWidth={1.5} />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="font-cairo text-sm text-error">{error || 'الطلب غير موجود'}</p>
        <button
          onClick={() => router.push('/admin/orders')}
          className="flex items-center gap-2 font-cairo text-sm text-gold hover:text-gold-dark"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          العودة للطلبات
        </button>
      </div>
    );
  }

  const address = order.shippingAddress;
  const customerName =
    order.customerName ||
    [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') ||
    address?.fullName ||
    '---';
  const customerPhone = order.customerPhone || order.user?.phone || address?.phone || '---';
  const paymentMethod = order.payment?.method || order.paymentMethod || '---';
  const paymentStatus = order.payment?.status || order.paymentStatus;
  const stripeId = order.payment?.stripePaymentId || order.stripePaymentId;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone/30 bg-white text-charcoal transition-colors hover:border-gold hover:text-gold sm:h-9 sm:w-9"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <h1 className="font-cairo text-base font-bold text-espresso sm:text-2xl">
            طلب #{order.orderNumber}
          </h1>
        </div>

        <StatusDropdown
          currentStatus={order.status}
          onUpdate={handleStatusUpdate}
          updating={updating}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left: Order Items (2 cols) */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Items Card */}
          <div className="rounded-xl border border-stone/30 bg-white shadow-warm">
            <div className="border-stone/15 border-b px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="flex items-center gap-2 font-cairo text-base font-bold text-espresso">
                <Package className="h-5 w-5 text-gold" strokeWidth={1.5} />
                عناصر الطلب
                <span className="font-cairo text-sm font-normal text-warm-gray">
                  ({order.items?.length || 0})
                </span>
              </h2>
            </div>
            <div className="divide-y divide-stone/10">
              {order.items?.length > 0 ? (
                order.items.map((item) => {
                  const imageUrl = item.product?.images?.[0]?.url;
                  const lineTotal = Number(item.priceMAD) * item.quantity;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
                    >
                      {/* Image */}
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream sm:h-16 sm:w-16">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product?.title || ''}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-6 w-6 text-stone" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-cairo text-sm font-medium text-espresso">
                          {item.product?.title || 'منتج محذوف'}
                        </p>
                        <p className="mt-1 font-cairo text-xs text-warm-gray">
                          {Number(item.priceMAD || 0).toFixed(2)} د.م. × {item.quantity}
                        </p>
                      </div>

                      {/* Line Total */}
                      <p className="shrink-0 font-cairo text-sm font-semibold text-espresso">
                        {lineTotal.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-warm-gray">د.م.</span>
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="font-cairo text-sm text-warm-gray">لا توجد عناصر</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="rounded-xl border border-stone/30 bg-white shadow-warm">
            <div className="border-stone/15 border-b px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="flex items-center gap-2 font-cairo text-base font-bold text-espresso">
                <User className="h-5 w-5 text-gold" strokeWidth={1.5} />
                معلومات العميل
              </h2>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" strokeWidth={1.5} />
                <div>
                  <p className="font-cairo text-xs text-warm-gray">الاسم</p>
                  <p className="font-cairo text-sm font-medium text-espresso">{customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" strokeWidth={1.5} />
                <div>
                  <p className="font-cairo text-xs text-warm-gray">الهاتف</p>
                  <p className="font-cairo text-sm font-medium text-espresso" dir="ltr">
                    {customerPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" strokeWidth={1.5} />
                <div>
                  <p className="font-cairo text-xs text-warm-gray">العنوان</p>
                  <p className="font-cairo text-sm font-medium text-espresso">
                    {[
                      order.customerAddress || address?.address,
                      order.customerCity || address?.city,
                      address?.region,
                      address?.postalCode
                    ]
                      .filter(Boolean)
                      .join('، ') || '---'}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" strokeWidth={1.5} />
                  <div>
                    <p className="font-cairo text-xs text-warm-gray">ملاحظات</p>
                    <p className="font-cairo text-sm font-medium text-espresso">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary + Payment + Dates */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="rounded-xl border border-stone/30 bg-white shadow-warm">
            <div className="border-stone/15 border-b px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="font-cairo text-base font-bold text-espresso">ملخص الطلب</h2>
            </div>
            <div className="space-y-3 p-3 sm:p-5">
              {order.subtotalMAD != null && (
                <div className="flex items-center justify-between">
                  <span className="font-cairo text-sm text-warm-gray">المجموع الفرعي</span>
                  <span className="font-cairo text-sm text-charcoal">
                    {Number(order.subtotalMAD).toFixed(2)} د.م.
                  </span>
                </div>
              )}
              {order.discountMAD != null && Number(order.discountMAD) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-cairo text-sm text-warm-gray">
                    الخصم
                    {order.promoCode && (
                      <span className="mr-1 rounded bg-gold/10 px-1.5 py-0.5 font-cairo text-xs text-gold-dark">
                        {order.promoCode}
                      </span>
                    )}
                  </span>
                  <span className="font-cairo text-sm text-success">
                    -{Number(order.discountMAD).toFixed(2)} د.م.
                  </span>
                </div>
              )}
              {order.shippingMAD != null && (
                <div className="flex items-center justify-between">
                  <span className="font-cairo text-sm text-warm-gray">الشحن</span>
                  <span className="font-cairo text-sm text-charcoal">
                    {Number(order.shippingMAD) > 0
                      ? `${Number(order.shippingMAD).toFixed(2)} د.م.`
                      : 'مجاني'}
                  </span>
                </div>
              )}
              <div className="border-stone/15 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-cairo text-sm font-bold text-espresso">الإجمالي</span>
                  <span className="font-cairo text-lg font-bold text-gold-dark">
                    {Number(order.totalMAD || 0).toFixed(2)} د.م.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="rounded-xl border border-stone/30 bg-white shadow-warm">
            <div className="border-stone/15 border-b px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="flex items-center gap-2 font-cairo text-base font-bold text-espresso">
                <CreditCard className="h-5 w-5 text-gold" strokeWidth={1.5} />
                معلومات الدفع
              </h2>
            </div>
            <div className="space-y-3 p-3 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="font-cairo text-sm text-warm-gray">طريقة الدفع</span>
                <span className="font-cairo text-sm font-medium text-charcoal">
                  {paymentLabels[paymentMethod] || paymentMethod}
                </span>
              </div>
              {paymentStatus && (
                <div className="flex items-center justify-between">
                  <span className="font-cairo text-sm text-warm-gray">حالة الدفع</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-cairo text-xs font-medium ${
                      paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : paymentStatus === 'REFUNDED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {paymentStatusLabels[paymentStatus] || paymentStatus}
                  </span>
                </div>
              )}
              {stripeId && (
                <div className="flex items-start gap-2">
                  <Hash className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="font-cairo text-xs text-warm-gray">معرّف Stripe</p>
                    <p className="truncate font-cairo text-xs font-medium text-charcoal" dir="ltr">
                      {stripeId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates Card */}
          <div className="rounded-xl border border-stone/30 bg-white shadow-warm">
            <div className="border-stone/15 border-b px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="flex items-center gap-2 font-cairo text-base font-bold text-espresso">
                <Calendar className="h-5 w-5 text-gold" strokeWidth={1.5} />
                التواريخ
              </h2>
            </div>
            <div className="space-y-3 p-3 sm:p-5">
              <div>
                <p className="font-cairo text-xs text-warm-gray">تاريخ الإنشاء</p>
                <p className="mt-0.5 font-cairo text-sm text-charcoal">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div>
                  <p className="font-cairo text-xs text-warm-gray">آخر تحديث</p>
                  <p className="mt-0.5 font-cairo text-sm text-charcoal">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
