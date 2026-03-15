'use client';

import { useEffect, useState } from 'react';
import {
  getAnalyticsOverview,
  getRevenueData,
  getBestSellers,
  getOrdersByStatus,
  getLowStockProducts
} from '@/lib/admin-api';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface BestSeller {
  productId: string;
  title: string;
  totalQuantity?: number;
  totalSold?: number;
  totalRevenue?: number;
  image?: string;
  imageUrl?: string;
}

interface OrderStatusCount {
  status: string;
  _count?: number;
  count?: number;
}

interface LowStockProduct {
  id: string;
  title: string;
  stockQuantity: number;
  priceMAD?: number;
  images?: { url: string }[];
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

const statusColors: Record<string, string> = {
  PENDING: '#EAB308',
  CONFIRMED: '#3B82F6',
  PROCESSING: '#8B5CF6',
  SHIPPED: '#6366F1',
  DELIVERED: '#22C55E',
  CANCELLED: '#EF4444',
  REFUNDED: '#6B7280'
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<Record<string, number> | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatusCount[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [days]);

  async function loadData() {
    setLoading(true);
    try {
      const [ov, rev, bs, os, ls] = await Promise.all([
        getAnalyticsOverview(),
        getRevenueData(days),
        getBestSellers(10),
        getOrdersByStatus(),
        getLowStockProducts(10)
      ]);
      setOverview(ov);
      setRevenue(Array.isArray(rev) ? rev : rev.data || []);
      setBestSellers(Array.isArray(bs) ? bs : bs.data || []);
      setOrderStats(Array.isArray(os) ? os : os.data || []);
      setLowStock(Array.isArray(ls) ? ls : ls.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const totalRevenue = revenue.reduce((sum, d) => sum + Number(d.revenue), 0);
  const avgDaily = revenue.length ? totalRevenue / revenue.length : 0;

  // Compare first half vs second half for trend
  const mid = Math.floor(revenue.length / 2);
  const firstHalf = revenue.slice(0, mid).reduce((s, d) => s + Number(d.revenue), 0);
  const secondHalf = revenue.slice(mid).reduce((s, d) => s + Number(d.revenue), 0);
  const trending = secondHalf >= firstHalf;

  const totalOrders = orderStats.reduce((s, o) => s + (o.count ?? o._count ?? 0), 0);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-2 font-cairo text-xl font-bold text-espresso sm:text-2xl">
          <BarChart3 className="h-5 w-5 text-gold sm:h-6 sm:w-6" strokeWidth={1.5} />
          التحليلات
        </h1>
        <div className="flex gap-1.5 sm:gap-2">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-lg px-2.5 py-1.5 font-cairo text-xs font-medium transition-colors sm:px-3 ${
                days === d ? 'bg-gold text-espresso' : 'hover:bg-gold/15 bg-cream text-charcoal'
              }`}
            >
              {d} يوم
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <div className="flex items-center gap-2 font-cairo text-xs text-warm-gray sm:text-sm">
            <DollarSign className="h-4 w-4" />
            إجمالي الإيرادات
          </div>
          <p className="mt-1 font-cairo text-lg font-bold text-espresso sm:mt-2 sm:text-2xl">
            {totalRevenue.toFixed(0)}{' '}
            <span className="text-xs font-normal text-warm-gray sm:text-sm">د.م.</span>
          </p>
          <div
            className={`mt-1 flex items-center gap-1 font-cairo text-xs ${
              trending ? 'text-success' : 'text-error'
            }`}
          >
            {trending ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trending ? 'اتجاه تصاعدي' : 'اتجاه تنازلي'}
          </div>
        </div>

        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <div className="flex items-center gap-2 font-cairo text-xs text-warm-gray sm:text-sm">
            <ShoppingCart className="h-4 w-4" />
            إجمالي الطلبات
          </div>
          <p className="mt-1 font-cairo text-lg font-bold text-espresso sm:mt-2 sm:text-2xl">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <div className="flex items-center gap-2 font-cairo text-xs text-warm-gray sm:text-sm">
            <DollarSign className="h-4 w-4" />
            متوسط يومي
          </div>
          <p className="mt-1 font-cairo text-lg font-bold text-espresso sm:mt-2 sm:text-2xl">
            {avgDaily.toFixed(0)}{' '}
            <span className="text-xs font-normal text-warm-gray sm:text-sm">د.م.</span>
          </p>
        </div>

        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <div className="flex items-center gap-2 font-cairo text-xs text-warm-gray sm:text-sm">
            <DollarSign className="h-4 w-4" />
            متوسط قيمة الطلب
          </div>
          <p className="mt-1 font-cairo text-lg font-bold text-espresso sm:mt-2 sm:text-2xl">
            {Number(overview?.avgOrderValue || 0).toFixed(0)}{' '}
            <span className="text-xs font-normal text-warm-gray sm:text-sm">د.م.</span>
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
        <h3 className="mb-3 font-cairo text-sm font-bold text-espresso sm:mb-4 sm:text-lg">
          الإيرادات اليومية (آخر {days} يوم)
        </h3>
        {revenue.length > 0 ? (
          <div className="flex h-40 items-end gap-[1px] sm:h-64 sm:gap-[2px]">
            {revenue.map((d) => {
              const max = Math.max(...revenue.map((r) => Number(r.revenue)), 1);
              const height = Math.max((Number(d.revenue) / max) * 100, 1);
              return (
                <div key={d.date} className="group relative flex flex-1 flex-col items-center">
                  <div className="absolute -top-10 z-10 hidden whitespace-nowrap rounded bg-espresso px-2 py-1 font-cairo text-xs text-white shadow-warm-md group-hover:block">
                    {new Date(d.date).toLocaleDateString('ar-MA')}
                    <br />
                    {Number(d.revenue).toFixed(0)} د.م.
                  </div>
                  <div
                    className="w-full rounded-t bg-gold/60 transition-all duration-200 hover:bg-gold"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center font-cairo text-sm text-warm-gray">
            لا توجد بيانات للفترة المحددة
          </p>
        )}
      </div>

      {/* Order Status Distribution + Best Sellers */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Order Status */}
        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <h3 className="mb-3 font-cairo text-sm font-bold text-espresso sm:mb-4 sm:text-lg">
            توزيع الطلبات حسب الحالة
          </h3>
          {totalOrders > 0 ? (
            <div className="space-y-3">
              {orderStats.map((s) => {
                const pct = totalOrders ? ((s.count ?? s._count ?? 0) / totalOrders) * 100 : 0;
                return (
                  <div key={s.status}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-cairo text-sm text-charcoal">
                        {statusLabels[s.status] || s.status}
                      </span>
                      <span className="font-cairo text-xs text-warm-gray">
                        {s.count ?? s._count ?? 0} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: statusColors[s.status] || '#6B7280'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center font-cairo text-sm text-warm-gray">لا توجد طلبات</p>
          )}
        </div>

        {/* Best Sellers */}
        <div className="rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 font-cairo text-sm font-bold text-espresso sm:mb-4 sm:text-lg">
            <Package className="h-4 w-4 text-gold sm:h-5 sm:w-5" strokeWidth={1.5} />
            الأكثر مبيعاً (أعلى 10)
          </h3>
          <div className="space-y-2.5">
            {bestSellers.map((p, i) => {
              const maxQty = bestSellers[0]?.totalQuantity || 1;
              return (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="bg-gold/15 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-cairo text-xs font-bold text-gold-dark">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-cairo text-sm text-espresso">{p.title}</p>
                    <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-gold/70"
                        style={{
                          width: `${((p.totalSold ?? p.totalQuantity ?? 0) / maxQty) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 font-cairo text-xs text-warm-gray">
                    {p.totalSold ?? p.totalQuantity ?? 0} وحدة
                  </span>
                </div>
              );
            })}
            {bestSellers.length === 0 && (
              <p className="py-4 text-center font-cairo text-sm text-warm-gray">لا توجد بيانات</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-3 sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 font-cairo text-sm font-bold text-espresso sm:mb-4 sm:text-lg">
            <AlertTriangle className="h-4 w-4 text-error sm:h-5 sm:w-5" strokeWidth={1.5} />
            تنبيه المخزون المنخفض
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-warm"
              >
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-cairo text-sm font-medium text-espresso">{p.title}</p>
                </div>
                <span className="bg-error/15 rounded-full px-2 py-0.5 font-cairo text-xs font-bold text-error">
                  {p.stockQuantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
