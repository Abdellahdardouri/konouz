'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAdminOrders } from '@/lib/admin-api';
import { ShoppingCart, Loader2, ChevronLeft, ChevronRight, Package } from 'lucide-react';

// ---------- Types ----------
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: string;
  quantity: number;
  priceMAD: number;
  product?: { title: string };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalMAD: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  items?: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

// ---------- Constants ----------
const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'الكل', value: 'ALL' },
  { label: 'قيد الانتظار', value: 'PENDING' },
  { label: 'مؤكد', value: 'CONFIRMED' },
  { label: 'قيد التحضير', value: 'PROCESSING' },
  { label: 'تم الشحن', value: 'SHIPPED' },
  { label: 'تم التوصيل', value: 'DELIVERED' },
  { label: 'ملغي', value: 'CANCELLED' }
];

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
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
};

const paymentLabels: Record<string, string> = {
  STRIPE: 'بطاقة',
  CASH_ON_DELIVERY: 'نقداً عند الاستلام'
};

const LIMIT = 15;

// ---------- Helpers ----------
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ---------- Component ----------
export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStatus = (searchParams.get('status') as OrderStatus | 'ALL') || 'ALL';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; status?: string } = {
        page,
        limit: LIMIT
      };
      if (activeStatus !== 'ALL') {
        params.status = activeStatus;
      }
      const res = await getAdminOrders(params);
      // unwrap returns { data: [...], total, page, totalPages } for paginated endpoints
      const ordersList = Array.isArray(res) ? res : res.data || res.orders || [];
      setOrders(Array.isArray(ordersList) ? ordersList : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || ordersList.length || 0);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('فشل في تحميل الطلبات');
      setOrders([]);
    }
    setLoading(false);
  }, [page, activeStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeStatus !== 'ALL') params.set('status', activeStatus);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(`/admin/orders${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [activeStatus, page, router]);

  function handleTabChange(status: OrderStatus | 'ALL') {
    setActiveStatus(status);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 font-cairo text-2xl font-bold text-espresso">
          <ShoppingCart className="h-6 w-6 text-gold" strokeWidth={1.5} />
          الطلبات
        </h1>
        {!loading && <span className="font-cairo text-sm text-warm-gray">{total} طلب</span>}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-full px-4 py-2 font-cairo text-sm font-medium transition-all duration-200 ${
              activeStatus === tab.value
                ? 'bg-gold text-white shadow-sm'
                : 'border border-stone/30 bg-white text-charcoal hover:border-gold/50 hover:text-gold-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" strokeWidth={1.5} />
        </div>
      ) : error ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-error/20 bg-error/5 p-8">
          <p className="font-cairo text-sm text-error">{error}</p>
          <button
            onClick={fetchOrders}
            className="rounded-lg bg-error/10 px-4 py-2 font-cairo text-sm font-medium text-error transition-colors hover:bg-error/20"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-stone/20 bg-white p-8 shadow-warm">
          <Package className="h-12 w-12 text-stone" strokeWidth={1.5} />
          <p className="font-cairo text-base font-medium text-warm-gray">لا توجد طلبات</p>
          {activeStatus !== 'ALL' && (
            <button
              onClick={() => handleTabChange('ALL')}
              className="font-cairo text-sm text-gold hover:text-gold-dark"
            >
              عرض جميع الطلبات
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: Order Cards */}
          <div className="space-y-3 lg:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="cursor-pointer rounded-xl border border-stone/30 bg-white p-4 shadow-warm transition-shadow hover:shadow-warm-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-cairo text-sm font-bold text-espresso">
                      #{order.orderNumber}
                    </p>
                    <p className="mt-0.5 font-cairo text-xs text-charcoal">{order.customerName}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 font-cairo text-xs font-medium ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="border-stone/15 mt-3 flex items-center justify-between border-t pt-3">
                  <span className="font-cairo text-sm font-bold text-espresso">
                    {Number(order.totalMAD || 0).toFixed(0)} د.م.
                  </span>
                  <span className="font-cairo text-xs text-warm-gray">
                    {paymentLabels[order.paymentMethod] || order.paymentMethod}
                  </span>
                  <span className="font-cairo text-xs text-warm-gray">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Orders Table */}
          <div className="hidden overflow-hidden rounded-xl border border-stone/30 bg-white shadow-warm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-stone/20 bg-cream/50">
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      رقم الطلب
                    </th>
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      العميل
                    </th>
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      المبلغ
                    </th>
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      طريقة الدفع
                    </th>
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      الحالة
                    </th>
                    <th className="px-4 py-3 font-cairo text-xs font-semibold text-warm-gray">
                      التاريخ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="cursor-pointer border-b border-stone/10 transition-colors hover:bg-cream/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-cairo text-sm font-semibold text-espresso">
                        #{order.orderNumber}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-cairo text-sm text-charcoal">
                        {order.customerName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-cairo text-sm font-medium text-espresso">
                        {Number(order.totalMAD || 0).toFixed(2)}{' '}
                        <span className="text-warm-gray">د.م.</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-cairo text-sm text-charcoal">
                        {paymentLabels[order.paymentMethod] || order.paymentMethod}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 font-cairo text-xs font-medium ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-cairo text-sm text-warm-gray">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone/30 bg-white text-charcoal transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first, last, current, and neighbors
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push('dots');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'dots' ? (
                    <span key={`dots-${idx}`} className="px-1 font-cairo text-sm text-warm-gray">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-cairo text-sm font-medium transition-colors ${
                        page === item
                          ? 'bg-gold text-white shadow-sm'
                          : 'border border-stone/30 bg-white text-charcoal hover:border-gold hover:text-gold'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone/30 bg-white text-charcoal transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
