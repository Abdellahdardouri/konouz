'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Save,
  Loader2,
  Upload,
  X,
  Trash2,
  ImagePlus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  getAdminProduct,
  getAdminCategories,
  createProduct,
  updateProduct,
  uploadProductImages,
  deleteProductImage
} from '@/lib/admin-api';

// ---------- Types ----------
interface ProductImage {
  id: string;
  url: string;
  position?: number;
}

interface Category {
  id: string;
  title: string;
  name?: string;
}

interface ProductData {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  categoryId?: string;
  priceMAD: number;
  comparePriceMAD?: number;
  stockQuantity: number;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  availableForSale: boolean;
  images: ProductImage[];
}

interface FormErrors {
  title?: string;
  priceMAD?: string;
}

// ---------- Toggle Component ----------
function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-stone/30 bg-white px-4 py-3 transition-colors hover:border-gold/40">
      <span className="font-cairo text-sm text-espresso">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-gold' : 'bg-stone/40'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'right-0.5' : 'right-[22px]'
          }`}
        />
      </button>
    </label>
  );
}

// ---------- Main Page ----------
export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  // Form state
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceMAD, setPriceMAD] = useState('');
  const [comparePriceMAD, setComparePriceMAD] = useState('');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [availableForSale, setAvailableForSale] = useState(true);

  // Images
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getAdminCategories();
        setCategories(Array.isArray(res) ? res : res.data || []);
      } catch {
        // categories load failed silently
      }
    }
    loadCategories();
  }, []);

  // Fetch product data for edit mode
  useEffect(() => {
    if (isNew) return;
    async function loadProduct() {
      try {
        const product: ProductData = await getAdminProduct(id);
        setTitle(product.title || '');
        setTitleEn(product.titleEn || '');
        setDescription(product.description || '');
        setCategoryId(product.categoryId || '');
        setPriceMAD(product.priceMAD?.toString() || '');
        setComparePriceMAD(product.comparePriceMAD?.toString() || '');
        setStockQuantity(product.stockQuantity?.toString() || '0');
        setTags(Array.isArray(product.tags) ? product.tags.join(', ') : '');
        setIsFeatured(product.isFeatured || false);
        setIsBestSeller(product.isBestSeller || false);
        setIsNewArrival(product.isNewArrival || false);
        setAvailableForSale(product.availableForSale ?? true);
        setExistingImages(product.images || []);
      } catch (err) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'فشل تحميل بيانات المنتج'
        });
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, isNew]);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Validate form
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'اسم المنتج مطلوب';
    const price = parseFloat(priceMAD);
    if (!priceMAD || isNaN(price) || price <= 0)
      errs.priceMAD = 'السعر مطلوب ويجب أن يكون رقم موجب';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Handle file selection
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setNewFiles((prev) => [...prev, ...fileArray]);
    const urls = fileArray.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  }, []);

  // Remove new file from queue
  function removeNewFile(index: number) {
    URL.revokeObjectURL(previewUrls[index]!);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  }

  // Delete existing image
  async function handleDeleteImage(imageId: string) {
    if (isNew) return;
    setDeletingImageId(imageId);
    try {
      await deleteProductImage(id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'فشل حذف الصورة'
      });
    }
    setDeletingImageId(null);
  }

  // Drag & Drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  // Save handler
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setMessage(null);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      description: description.trim() || undefined,
      categoryId: categoryId || undefined,
      priceMAD: parseFloat(priceMAD),
      comparePriceMAD: comparePriceMAD ? parseFloat(comparePriceMAD) : undefined,
      stockQuantity: parseInt(stockQuantity, 10) || 0,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isFeatured,
      isBestSeller,
      isNewArrival,
      availableForSale
    };

    try {
      let productId = id;

      if (isNew) {
        const created = await createProduct(payload);
        productId = created.id || created.data?.id;
      } else {
        await updateProduct(id, payload);
      }

      // Upload new images
      if (newFiles.length > 0 && productId) {
        await uploadProductImages(productId, newFiles);
        setNewFiles([]);
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
      }

      setMessage({
        type: 'success',
        text: isNew ? 'تم إنشاء المنتج بنجاح' : 'تم تحديث المنتج بنجاح'
      });

      if (isNew && productId) {
        // Redirect to edit page after creation
        setTimeout(() => {
          router.push(`/admin/products/${productId}`);
        }, 1000);
      } else {
        // Refresh images for edit mode
        if (!isNew) {
          try {
            const updated: ProductData = await getAdminProduct(id);
            setExistingImages(updated.images || []);
          } catch {
            // image refresh failed
          }
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'فشل حفظ المنتج'
      });
    }
    setSaving(false);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-cream hover:text-espresso"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <h1 className="font-cairo text-lg font-bold text-espresso sm:text-2xl">
          {isNew ? 'منتج جديد' : 'تعديل المنتج'}
        </h1>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-success/30 bg-success/5'
              : 'border-error/30 bg-error/5'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.5} />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-error" strokeWidth={1.5} />
          )}
          <p
            className={`font-cairo text-sm ${
              message.type === 'success' ? 'text-success' : 'text-error'
            }`}
          >
            {message.text}
          </p>
          <button
            onClick={() => setMessage(null)}
            className="mr-auto text-warm-gray hover:text-espresso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h2 className="mb-4 font-cairo text-base font-bold text-espresso">المعلومات الأساسية</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                اسم المنتج <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل اسم المنتج"
                className={`w-full rounded-lg border bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-stone/40 focus:border-gold focus:ring-gold/20'
                }`}
              />
              {errors.title && <p className="mt-1 font-cairo text-xs text-error">{errors.title}</p>}
            </div>

            {/* Title En */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                اسم المنتج (إنجليزي)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Product title in English"
                dir="ltr"
                className="w-full rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                الوصف
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف المنتج..."
                rows={4}
                className="w-full resize-y rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                القسم
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                <option value="">بدون قسم</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title || cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                الوسوم
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="وسم1, وسم2, وسم3"
                className="w-full rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <p className="mt-1 font-cairo text-xs text-warm-gray">افصل بين الوسوم بفاصلة</p>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h2 className="mb-4 font-cairo text-base font-bold text-espresso">السعر والمخزون</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Price */}
            <div>
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                السعر (د.م.) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={priceMAD}
                onChange={(e) => setPriceMAD(e.target.value)}
                placeholder="0.00"
                dir="ltr"
                className={`w-full rounded-lg border bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 ${
                  errors.priceMAD
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-stone/40 focus:border-gold focus:ring-gold/20'
                }`}
              />
              {errors.priceMAD && (
                <p className="mt-1 font-cairo text-xs text-error">{errors.priceMAD}</p>
              )}
            </div>

            {/* Compare Price */}
            <div>
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                سعر المقارنة (د.م.)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={comparePriceMAD}
                onChange={(e) => setComparePriceMAD(e.target.value)}
                placeholder="0.00"
                dir="ltr"
                className="w-full rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
                الكمية في المخزون
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
                dir="ltr"
                className="w-full rounded-lg border border-stone/40 bg-white px-4 py-2.5 font-cairo text-sm text-espresso placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h2 className="mb-4 font-cairo text-base font-bold text-espresso">صور المنتج</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-cairo text-xs font-medium text-warm-gray">الصور الحالية</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="group relative">
                    <img
                      src={img.url}
                      alt=""
                      className="h-24 w-24 rounded-lg object-cover ring-1 ring-stone/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={deletingImageId === img.id}
                      className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white opacity-0 shadow transition-opacity disabled:opacity-50 group-hover:opacity-100"
                      title="حذف الصورة"
                    >
                      {deletingImageId === img.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Files Preview */}
          {previewUrls.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-cairo text-xs font-medium text-warm-gray">
                صور جديدة ({newFiles.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {previewUrls.map((url, i) => (
                  <div key={url} className="group relative">
                    <img
                      src={url}
                      alt=""
                      className="h-24 w-24 rounded-lg object-cover ring-1 ring-gold/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                      title="إزالة"
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? 'border-gold bg-gold/5'
                : 'border-stone/30 hover:border-gold/50 hover:bg-cream/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              {isDragging ? (
                <Upload className="h-8 w-8 text-gold" strokeWidth={1.5} />
              ) : (
                <ImagePlus className="h-8 w-8 text-warm-gray/50" strokeWidth={1.5} />
              )}
              <p className="font-cairo text-sm text-warm-gray">
                {isDragging ? 'أفلت الصور هنا' : 'اسحب الصور هنا أو اضغط للاختيار'}
              </p>
              <p className="font-cairo text-xs text-warm-gray/60">PNG, JPG, WebP</p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="rounded-xl border border-stone/30 bg-white p-5 shadow-warm">
          <h2 className="mb-4 font-cairo text-base font-bold text-espresso">خيارات العرض</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="متاح للبيع" checked={availableForSale} onChange={setAvailableForSale} />
            <Toggle label="منتج مميز" checked={isFeatured} onChange={setIsFeatured} />
            <Toggle label="الأكثر مبيعاً" checked={isBestSeller} onChange={setIsBestSeller} />
            <Toggle label="وصل حديثاً" checked={isNewArrival} onChange={setIsNewArrival} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            {saving ? 'جاري الحفظ...' : isNew ? 'إنشاء المنتج' : 'حفظ التعديلات'}
          </button>
          <Link
            href="/admin/products"
            className="rounded-lg border border-stone/40 px-6 py-2.5 font-cairo text-sm font-medium text-charcoal transition-colors hover:bg-cream"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
