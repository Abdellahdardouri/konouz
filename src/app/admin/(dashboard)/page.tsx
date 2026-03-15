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

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (!data.length) return <p className="text-center text-warm-gray">لا توجد بيانات</p>;

  const max = Math.max(...data.map((d) => Number(d.revenue)), 1);
  const last14 = data.slice(-14);

  return (
    <div className="flex h-28 items-end gap-px sm:h-48 sm:gap-1">
      {last14.map((d) => {
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
            <span className="mt-1 hidden font-cairo text-[10px] text-warm-gray sm:block">
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
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <h1 className="font-cairo text-lg font-bold text-espresso sm:text-2xl">لوحة التحكم</h1>

      {/* KPI Cards — stacked list on mobile, 5-col grid on desktop */}
      <div className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
        {[
          {
            label: 'إجمالي المبيعات',
            value: `${Number(overview?.totalRevenue || 0).toFixed(0)} د.م.`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-700'
          },
          {
            label: 'عدد الطلبات',
            value: String(overview?.totalOrders || 0),
            icon: ShoppingCart,
            color: 'bg-blue-100 text-blue-700'
          },
          {
            label: 'العملاء',
            value: String(overview?.totalCustomers || 0),
            icon: Users,
            color: 'bg-purple-100 text-purple-700'
          },
          {
            label: 'متوسط الطلب',
            value: `${Number(overview?.avgOrderValue || 0).toFixed(0)} د.م.`,
            icon: TrendingUp,
            color: 'bg-gold/20 text-gold-dark'
          },
          {
            label: 'طلبات معلقة',
            value: String(overview?.pendingOrders || 0),
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-700'
          }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex w-full items-center gap-3 overflow-hidden rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:flex-col sm:items-start sm:p-4"
            >
              <div className={`shrink-0 rounded-lg p-2 ${stat.color}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-cairo text-xs text-warm-gray">{stat.label}</p>
                <p className="font-cairo text-base font-bold text-espresso sm:text-xl">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="w-full overflow-hidden rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
        <h3 className="mb-3 font-cairo text-sm font-bold text-espresso sm:text-lg">
          الإيرادات (آخر 14 يوم)
        </h3>
        <RevenueChart data={revenue} />
      </div>

      {/* Order Status */}
      <div className="w-full overflow-hidden rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
        <h3 className="mb-3 font-cairo text-sm font-bold text-espresso sm:text-lg">حالة الطلبات</h3>
        <div className="flex flex-col gap-1.5">
          {orderStats.map((s) => (
            <div
              key={s.status}
              className="flex w-full items-center justify-between rounded-lg bg-cream px-3 py-2"
            >
              <span
                className={`rounded-full px-2 py-0.5 font-cairo text-[11px] font-medium ${
                  statusColors[s.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {statusLabels[s.status] || s.status}
              </span>
              <span className="font-cairo text-xs font-bold text-espresso">
                {s.count ?? s._count}
              </span>
            </div>
          ))}
          {orderStats.length === 0 && (
            <p className="text-center font-cairo text-sm text-warm-gray">لا توجد طلبات</p>
          )}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="w-full overflow-hidden rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
        <h3 className="mb-2 flex items-center gap-2 font-cairo text-sm font-bold text-espresso sm:text-lg">
          <Package className="h-4 w-4 text-gold" strokeWidth={1.5} />
          الأكثر مبيعاً
        </h3>
        <div className="flex flex-col gap-1.5">
          {bestSellers.map((p, i) => (
            <div
              key={p.productId}
              className="flex w-full items-center gap-2 overflow-hidden rounded-lg bg-cream/50 p-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 font-cairo text-[10px] font-bold text-gold-dark">
                {i + 1}
              </span>
              {(p.image || p.imageUrl) && (
                <img
                  src={p.image || p.imageUrl}
                  alt={p.title}
                  className="h-8 w-8 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-cairo text-xs font-medium text-espresso">{p.title}</p>
                <p className="font-cairo text-[10px] text-warm-gray">
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
      <div className="w-full overflow-hidden rounded-xl border border-stone/30 bg-white p-3 shadow-warm sm:p-5">
        <h3 className="mb-2 flex items-center gap-2 font-cairo text-sm font-bold text-espresso sm:text-lg">
          <AlertTriangle className="h-4 w-4 text-error" strokeWidth={1.5} />
          مخزون منخفض
        </h3>
        <div className="flex flex-col gap-1.5">
          {lowStock.map((p) => (
            <div
              key={p.id}
              className="flex w-full items-center gap-2 overflow-hidden rounded-lg bg-error/5 p-2"
            >
              {p.images?.[0]?.url && (
                <img
                  src={p.images[0].url}
                  alt={p.title}
                  className="h-8 w-8 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-cairo text-xs font-medium text-espresso">{p.title}</p>
              </div>
              <span className="bg-error/15 shrink-0 rounded-full px-2 py-0.5 font-cairo text-[10px] font-bold text-error">
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
  );
}
