'use client';

import { useEffect, useState } from 'react';
import { getAdminCustomers, getAdminCustomer } from '@/lib/admin-api';
import {
  Users,
  X,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  _count?: { orders: number };
  orderCount?: number;
  isGuest?: boolean;
}

interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  orders: {
    id: string;
    orderNumber: number;
    totalMAD: number;
    status: string;
    createdAt: string;
  }[];
  addresses: {
    id: string;
    line1: string;
    city: string;
    phone?: string;
    isDefault: boolean;
  }[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  PROCESSING: 'قيد التحضير',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
  REFUNDED: 'مسترجع'
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    loadCustomers();
  }, [page]);

  async function loadCustomers() {
    setLoading(true);
    try {
      const data = await getAdminCustomers({ page, limit });
      setCustomers(data.customers || data.data || data || []);
      setTotal(data.total || data.totalPages * limit || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function viewCustomer(id: string) {
    setDetailLoading(true);
    try {
      const data = await getAdminCustomer(id);
      setSelectedCustomer(data.customer || data);
    } catch (err) {
      console.error(err);
    }
    setDetailLoading(false);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-cairo text-xl font-bold text-espresso sm:text-2xl">
          <Users className="h-5 w-5 text-gold sm:h-6 sm:w-6" strokeWidth={1.5} />
          العملاء
        </h1>
        <span className="font-cairo text-xs text-warm-gray sm:text-sm">{total} عميل</span>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        </div>
      ) : (
        <div>
          {/* Mobile: Customer Cards */}
          <div className="space-y-3 lg:hidden">
            {customers.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-stone/30 bg-white p-4 shadow-warm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-cairo text-sm font-bold text-espresso">
                      {c.firstName} {c.lastName}
                      {c.isGuest && (
                        <span className="mr-2 rounded-full bg-warm-gray/10 px-2 py-0.5 font-cairo text-[10px] text-warm-gray">
                          زائر
                        </span>
                      )}
                    </p>
                    {c.email && (
                      <p className="mt-0.5 font-cairo text-xs text-charcoal">{c.email}</p>
                    )}
                    {c.phone && (
                      <p className="mt-0.5 font-cairo text-xs text-warm-gray">{c.phone}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-gold/10 px-2.5 py-1 font-cairo text-xs font-medium text-gold-dark">
                    {c._count?.orders ?? c.orderCount ?? 0} طلب
                  </span>
                </div>
                <div className="border-stone/15 mt-3 flex items-center justify-between border-t pt-3">
                  <span className="font-cairo text-xs text-warm-gray">
                    {new Date(c.createdAt).toLocaleDateString('ar-MA')}
                  </span>
                  <button
                    onClick={() => viewCustomer(c.id)}
                    className="rounded-lg bg-gold/10 px-3 py-1.5 font-cairo text-xs font-medium text-gold-dark hover:bg-gold/20"
                  >
                    التفاصيل
                  </button>
                </div>
              </div>
            ))}
            {customers.length === 0 && (
              <p className="py-8 text-center font-cairo text-sm text-warm-gray">لا يوجد عملاء</p>
            )}
          </div>

          {/* Desktop: Table */}
          <div className="hidden overflow-hidden rounded-xl border border-stone/30 bg-white shadow-warm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone/20 bg-cream/50">
                    <th className="px-4 py-3 text-right font-cairo text-sm font-medium text-warm-gray">
                      الاسم
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-sm font-medium text-warm-gray">
                      البريد
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-sm font-medium text-warm-gray">
                      الهاتف
                    </th>
                    <th className="px-4 py-3 text-center font-cairo text-sm font-medium text-warm-gray">
                      الطلبات
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-sm font-medium text-warm-gray">
                      تاريخ التسجيل
                    </th>
                    <th className="px-4 py-3 text-center font-cairo text-sm font-medium text-warm-gray">
                      عرض
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-stone/10 transition-colors hover:bg-cream/30"
                    >
                      <td className="px-4 py-3">
                        <span className="font-cairo text-sm font-medium text-espresso">
                          {c.firstName} {c.lastName}
                        </span>
                        {c.isGuest && (
                          <span className="mr-2 rounded-full bg-warm-gray/10 px-2 py-0.5 font-cairo text-[10px] text-warm-gray">
                            زائر
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-cairo text-sm text-charcoal">
                        {c.email || '—'}
                      </td>
                      <td className="px-4 py-3 font-cairo text-sm text-charcoal">
                        {c.phone || '—'}
                      </td>
                      <td className="px-4 py-3 text-center font-cairo text-sm font-medium text-espresso">
                        {c._count?.orders ?? c.orderCount ?? 0}
                      </td>
                      <td className="px-4 py-3 font-cairo text-sm text-warm-gray">
                        {new Date(c.createdAt).toLocaleDateString('ar-MA')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => viewCustomer(c.id)}
                          className="rounded-lg bg-gold/10 px-3 py-1.5 font-cairo text-xs font-medium text-gold-dark transition-colors hover:bg-gold/20"
                        >
                          التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center font-cairo text-sm text-warm-gray"
                      >
                        لا يوجد عملاء
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (both mobile and desktop) */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-2 text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="font-cairo text-sm text-warm-gray">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-2 text-charcoal transition-colors hover:bg-cream disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Customer Detail Modal */}
      {(selectedCustomer || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-warm-xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute left-4 top-4 text-warm-gray transition-colors hover:text-espresso"
            >
              <X className="h-5 w-5" />
            </button>

            {detailLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
              </div>
            ) : selectedCustomer ? (
              <div className="space-y-5">
                <h2 className="font-cairo text-xl font-bold text-espresso">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 font-cairo text-sm text-charcoal">
                    <Mail className="h-4 w-4 text-warm-gray" strokeWidth={1.5} />
                    {selectedCustomer.email}
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 font-cairo text-sm text-charcoal">
                      <Phone className="h-4 w-4 text-warm-gray" strokeWidth={1.5} />
                      {selectedCustomer.phone}
                    </div>
                  )}
                </div>

                {/* Addresses */}
                {selectedCustomer.addresses?.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-cairo text-sm font-bold text-espresso">العناوين</h3>
                    <div className="space-y-2">
                      {selectedCustomer.addresses.map((a) => (
                        <div key={a.id} className="flex items-start gap-2 rounded-lg bg-cream p-3">
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0 text-warm-gray"
                            strokeWidth={1.5}
                          />
                          <div className="font-cairo text-sm text-charcoal">
                            <p>{a.line1}</p>
                            <p>{a.city}</p>
                            {a.isDefault && (
                              <span className="bg-gold/15 mt-1 inline-block rounded px-2 py-0.5 text-xs text-gold-dark">
                                الافتراضي
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Orders */}
                <div>
                  <h3 className="mb-2 font-cairo text-sm font-bold text-espresso">
                    الطلبات ({selectedCustomer.orders?.length || 0})
                  </h3>
                  {selectedCustomer.orders?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomer.orders.map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between rounded-lg bg-cream p-3"
                        >
                          <div>
                            <p className="font-cairo text-sm font-medium text-espresso">
                              طلب #{o.orderNumber}
                            </p>
                            <p className="font-cairo text-xs text-warm-gray">
                              {new Date(o.createdAt).toLocaleDateString('ar-MA')}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-cairo text-sm font-bold text-espresso">
                              {Number(o.totalMAD || 0).toFixed(0)} د.م.
                            </p>
                            <span className="font-cairo text-xs text-warm-gray">
                              {statusLabels[o.status] || o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-cairo text-sm text-warm-gray">لا توجد طلبات</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
