'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  X,
  Package
} from 'lucide-react';
import { getAdminProducts, getAdminCategories, deleteProduct } from '@/lib/admin-api';

// ---------- Types ----------
interface ProductImage {
  id: string;
  url: string;
}

interface ProductCategory {
  id: string;
  title: string;
  name?: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  category?: ProductCategory;
  categoryId?: string;
  priceMAD: number;
  comparePriceMAD?: number;
  stockQuantity: number;
  availableForSale: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  images: ProductImage[];
}

interface Category {
  id: string;
  title: string;
  name?: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Delete Confirmation Dialog ----------
function DeleteDialog({
  productTitle,
  onConfirm,
  onCancel,
  isDeleting
}: {
  productTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-warm-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
            <Trash2 className="h-5 w-5 text-error" strokeWidth={1.5} />
          </div>
          <h3 className="font-cairo text-lg font-bold text-espresso">تأكيد الحذف</h3>
        </div>
        <p className="mb-6 font-cairo text-sm text-warm-gray">
          هل أنت متأكد من حذف المنتج{' '}
          <span className="font-medium text-espresso">&quot;{productTitle}&quot;</span>؟
          <br />
          لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-error px-4 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-error/90 disabled:opacity-50"
          >
            {isDeleting ? 'جاري الحذف...' : 'حذف'}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-stone/40 px-4 py-2.5 font-cairo text-sm font-medium text-charcoal transition-colors hover:bg-cream disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on category change
  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getAdminCategories();
        setCategories(Array.isArray(res) ? res : res.data || []);
      } catch {
        // silently fail, categories are optional for filtering
      }
    }
    loadCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res: ProductsResponse = await getAdminProducts({
        page,
        limit,
        q: debouncedSearch || undefined,
        category: categoryFilter || undefined
      });
      setProducts(Array.isArray(res) ? res : res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل المنتجات');
    }
    setLoading(false);
  }, [page, limit, debouncedSearch, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete handler
  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف المنتج');
    }
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-cairo text-xl font-bold text-espresso sm:text-2xl">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          منتج جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 text-warm-gray -translate-y-1/2"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث بالاسم..."
            className="w-full rounded-lg border border-stone/40 bg-white py-2.5 pl-4 pr-10 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 text-warm-gray -translate-y-1/2 hover:text-espresso"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:w-48"
        >
          <option value="">جميع الأقسام</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title || cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4">
          <p className="font-cairo text-sm text-error">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        </div>
      )}

      {/* Products List */}
      {!loading && products.length > 0 && (
        <div className="space-y-3 lg:space-y-0">
          {/* Mobile: Cards */}
          <div className="space-y-3 lg:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-stone/30 bg-white p-4 shadow-warm"
              >
                <div className="flex gap-3">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cream">
                      <Package className="h-6 w-6 text-warm-gray/50" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-cairo text-sm font-medium text-espresso">
                      {product.title}
                    </p>
                    <p className="mt-1 font-cairo text-xs text-warm-gray">
                      {product.category?.title || product.category?.name || '—'}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {product.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-cairo text-[10px] font-medium text-gold-dark">
                          <Star className="h-2.5 w-2.5" /> مميز
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-cairo text-[10px] font-medium text-success">
                          <TrendingUp className="h-2.5 w-2.5" /> الأكثر مبيعاً
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-stone/15 mt-3 flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-3">
                    <span className="font-cairo text-sm font-bold text-espresso">
                      {Number(product.priceMAD || 0).toFixed(0)} د.م.
                    </span>
                    <span
                      className={`font-cairo text-xs ${
                        product.stockQuantity < 5 ? 'text-error' : 'text-warm-gray'
                      }`}
                    >
                      المخزون: {product.stockQuantity}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        product.availableForSale ? 'bg-success' : 'bg-warm-gray/40'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="rounded-lg p-2 text-warm-gray hover:bg-gold/10 hover:text-gold-dark"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-lg p-2 text-warm-gray hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden overflow-hidden rounded-xl border border-stone/30 bg-white shadow-warm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone/20 bg-cream/50">
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      صورة
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      الاسم
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      القسم
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      السعر
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      المخزون
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-xs font-medium text-warm-gray">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/10">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-cream/30">
                      <td className="px-4 py-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cream">
                            <Package className="h-5 w-5 text-warm-gray/50" strokeWidth={1.5} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-cairo text-sm font-medium text-espresso">
                          {product.title}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-cairo text-[10px] font-medium text-gold-dark">
                              <Star className="h-2.5 w-2.5" /> مميز
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-cairo text-[10px] font-medium text-success">
                              <TrendingUp className="h-2.5 w-2.5" /> الأكثر مبيعاً
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-cairo text-[10px] font-medium text-blue-600">
                              جديد
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-cairo text-sm text-warm-gray">
                          {product.category?.title || product.category?.name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-cairo text-sm font-medium text-espresso">
                          {Number(product.priceMAD || 0).toFixed(0)} د.م.
                        </span>
                        {product.comparePriceMAD &&
                          Number(product.comparePriceMAD) > Number(product.priceMAD) && (
                            <span className="mr-2 font-cairo text-xs text-warm-gray line-through">
                              {Number(product.comparePriceMAD).toFixed(0)} د.م.
                            </span>
                          )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-cairo text-sm font-medium ${
                            product.stockQuantity < 5 ? 'text-error' : 'text-espresso'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              product.availableForSale ? 'bg-success' : 'bg-warm-gray/40'
                            }`}
                          />
                          <span className="font-cairo text-xs text-warm-gray">
                            {product.availableForSale ? 'متاح' : 'غير متاح'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-gold/10 hover:text-gold-dark"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-error/10 hover:text-error"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <p className="font-cairo text-xs text-warm-gray">
                عرض {(page - 1) * limit + 1} - {Math.min(page * limit, total)} من {total} منتج
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-white hover:text-espresso disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && p - arr[idx - 1]! > 1;
                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 font-cairo text-xs text-warm-gray">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`min-w-[32px] rounded-lg px-2 py-1.5 font-cairo text-xs transition-colors ${
                            p === page
                              ? 'bg-gold font-medium text-white'
                              : 'text-warm-gray hover:bg-white hover:text-espresso'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-white hover:text-espresso disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-stone/30 bg-white p-8 shadow-warm">
          <Package className="mb-4 h-12 w-12 text-warm-gray/40" strokeWidth={1} />
          <p className="mb-2 font-cairo text-lg font-medium text-espresso">لا توجد منتجات</p>
          <p className="mb-6 font-cairo text-sm text-warm-gray">
            {debouncedSearch || categoryFilter
              ? 'لم يتم العثور على منتجات تطابق معايير البحث'
              : 'ابدأ بإضافة منتجك الأول'}
          </p>
          {!debouncedSearch && !categoryFilter && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-gold-dark"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              منتج جديد
            </Link>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          productTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
