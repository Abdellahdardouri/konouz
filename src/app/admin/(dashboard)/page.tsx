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
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface OverviewData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  avgOrderValue: number;
  pendingOrders: number;
}

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
  handle: string;
  stockQuantity: number;
  images: { url: string }[];
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
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix
}: {
  label: string;
  value: number | string;
  icon: typeof DollarSign;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm transition-shadow hover:shadow-warm-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-cairo text-sm text-warm-gray">{label}</p>
          <p className="mt-2 font-cairo text-2xl font-bold text-espresso">
            {value}
            {suffix && <span className="mr-1 text-sm font-normal text-warm-gray">{suffix}</span>}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (!data.length) return <p className="text-center text-warm-gray">لا توجد بيانات</p>;

  const max = Math.max(...data.map((d) => Number(d.revenue)), 1);
  const last7 = data.slice(-14);

  return (
    <div className="flex h-48 items-end gap-1">
      {last7.map((d) => {
        const height = Math.max((Number(d.revenue) / max) * 100, 2);
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center">
            <div className="absolute -top-8 hidden rounded bg-espresso px-2 py-1 font-cairo text-xs text-white shadow group-hover:block">
              {Number(d.revenue).toFixed(0)} د.م.
            </div>
            <div
              className="w-full rounded-t bg-gold/70 transition-colors hover:bg-gold"
              style={{ height: `${height}%` }}
            />
            <span className="mt-1 font-cairo text-[10px] text-warm-gray">
              {new Date(d.date).getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatusCount[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ov, rev, bs, os, ls] = await Promise.all([
          getAnalyticsOverview(),
          getRevenueData(30),
          getBestSellers(5),
          getOrdersByStatus(),
          getLowStockProducts(10)
        ]);
        setOverview(ov);
        setRevenue(Array.isArray(rev) ? rev : rev.data || []);
        setBestSellers(Array.isArray(bs) ? bs : bs.data || []);
        setOrderStats(Array.isArray(os) ? os : os.data || []);
        setLowStock(Array.isArray(ls) ? ls : ls.data || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-cairo text-2xl font-bold text-espresso">لوحة التحكم</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="إجمالي المبيعات"
          value={Number(overview?.totalRevenue || 0).toFixed(0)}
          suffix="د.م."
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="عدد الطلبات"
          value={overview?.totalOrders || 0}
          icon={ShoppingCart}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="العملاء"
          value={overview?.totalCustomers || 0}
          icon={Users}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          label="متوسط قيمة الطلب"
          value={Number(overview?.avgOrderValue || 0).toFixed(0)}
          suffix="د.م."
          icon={TrendingUp}
          color="bg-gold/20 text-gold-dark"
        />
        <StatCard
          label="طلبات معلقة"
          value={overview?.pendingOrders || 0}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
      </div>

      {/* Revenue Chart + Order Status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm lg:col-span-2">
          <h3 className="mb-4 font-cairo text-lg font-bold text-espresso">
            الإيرادات (آخر 14 يوم)
          </h3>
          <RevenueChart data={revenue} />
        </div>

        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h3 className="mb-4 font-cairo text-lg font-bold text-espresso">حالة الطلبات</h3>
          <div className="space-y-2">
            {orderStats.map((s) => (
              <div
                key={s.status}
                className="flex items-center justify-between rounded-lg bg-cream px-3 py-2"
              >
                <span
                  className={`rounded-full px-2.5 py-0.5 font-cairo text-xs font-medium ${
                    statusColors[s.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[s.status] || s.status}
                </span>
                <span className="font-cairo text-sm font-bold text-espresso">
                  {s.count ?? s._count}
                </span>
              </div>
            ))}
            {orderStats.length === 0 && (
              <p className="text-center font-cairo text-sm text-warm-gray">لا توجد طلبات</p>
            )}
          </div>
        </div>
      </div>

      {/* Best Sellers + Low Stock */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Best Sellers */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h3 className="mb-4 flex items-center gap-2 font-cairo text-lg font-bold text-espresso">
            <Package className="h-5 w-5 text-gold" strokeWidth={1.5} />
            الأكثر مبيعاً
          </h3>
          <div className="space-y-3">
            {bestSellers.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3 rounded-lg bg-cream/50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 font-cairo text-xs font-bold text-gold-dark">
                  {i + 1}
                </span>
                {(p.image || p.imageUrl) && (
                  <img
                    src={p.image || p.imageUrl}
                    alt={p.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-cairo text-sm font-medium text-espresso">{p.title}</p>
                  <p className="font-cairo text-xs text-warm-gray">
                    {p.totalSold ?? p.totalQuantity} وحدة
                  </p>
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && (
              <p className="text-center font-cairo text-sm text-warm-gray">لا توجد بيانات</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h3 className="mb-4 flex items-center gap-2 font-cairo text-lg font-bold text-espresso">
            <AlertTriangle className="h-5 w-5 text-error" strokeWidth={1.5} />
            مخزون منخفض
          </h3>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg bg-error/5 p-3">
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
                <span className="bg-error/15 rounded-full px-2.5 py-0.5 font-cairo text-xs font-bold text-error">
                  {p.stockQuantity} متبقي
                </span>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-center font-cairo text-sm text-warm-gray">
                لا توجد منتجات منخفضة المخزون
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
