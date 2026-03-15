'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Check,
  Image as ImageIcon,
  GripVertical,
  Loader2
} from 'lucide-react';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/lib/admin-api';

// ---------- Types ----------

interface Category {
  id: string;
  title: string;
  titleEn: string;
  handle: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { products: number };
}

interface CategoryFormData {
  title: string;
  titleEn: string;
  handle: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

type ModalMode = 'create' | 'edit' | null;

interface Toast {
  message: string;
  type: 'success' | 'error';
}

// ---------- Helpers ----------

const emptyForm: CategoryFormData = {
  title: '',
  titleEn: '',
  handle: '',
  description: '',
  imageUrl: '',
  sortOrder: 0
};

function generateHandle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ---------- Modal Component ----------

function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg animate-fadeIn rounded-2xl border border-stone/30 bg-white shadow-warm-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone/20 px-6 py-4">
          <h2 className="font-cairo text-lg font-bold text-espresso">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-warm-gray transition-colors hover:bg-cream hover:text-espresso"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ---------- Toast Component ----------

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed left-4 top-4 z-[200] animate-fadeIn">
      <div
        className={`flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-warm-lg ${
          toast.type === 'success'
            ? 'border border-success/20 bg-success/10 text-success'
            : 'border border-error/20 bg-error/10 text-error'
        }`}
      >
        {toast.type === 'success' ? (
          <Check className="h-5 w-5 shrink-0" strokeWidth={1.5} />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={1.5} />
        )}
        <p className="font-cairo text-sm font-medium">{toast.message}</p>
        <button onClick={onDismiss} className="mr-2 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// ---------- Category Form ----------

function CategoryForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  saving,
  submitLabel
}: {
  data: CategoryFormData;
  onChange: (data: CategoryFormData) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  const handleTitleEnChange = (value: string) => {
    const updated = { ...data, titleEn: value };
    // Auto-generate handle from English title if handle is empty or was auto-generated
    if (!data.handle || data.handle === generateHandle(data.titleEn)) {
      updated.handle = generateHandle(value);
    }
    onChange(updated);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Title (Arabic) */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
          اسم القسم (عربي) <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="مثال: إلكترونيات"
          required
          className="w-full rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Title (English) */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
          اسم القسم (إنجليزي)
        </label>
        <input
          type="text"
          value={data.titleEn}
          onChange={(e) => handleTitleEnChange(e.target.value)}
          placeholder="e.g. Electronics"
          dir="ltr"
          className="w-full rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Handle */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
          المعرّف (Handle)
        </label>
        <input
          type="text"
          value={data.handle}
          onChange={(e) => onChange({ ...data, handle: e.target.value })}
          placeholder="electronics"
          dir="ltr"
          className="w-full rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <p className="mt-1 font-cairo text-xs text-warm-gray">
          يتم إنشاؤه تلقائياً من الاسم الإنجليزي إذا تُرك فارغاً
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">الوصف</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="وصف مختصر للقسم..."
          rows={3}
          className="w-full resize-none rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
          رابط الصورة
        </label>
        <input
          type="url"
          value={data.imageUrl}
          onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
          placeholder="https://..."
          dir="ltr"
          className="w-full rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors placeholder:text-warm-gray/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        {data.imageUrl && (
          <div className="mt-2 overflow-hidden rounded-lg border border-stone/20">
            <img
              src={data.imageUrl}
              alt="معاينة"
              className="h-24 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Sort Order */}
      <div>
        <label className="mb-1.5 block font-cairo text-sm font-medium text-charcoal">
          ترتيب العرض
        </label>
        <input
          type="number"
          value={data.sortOrder}
          onChange={(e) => onChange({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
          min={0}
          className="w-32 rounded-xl border border-stone/40 bg-white-warm px-4 py-2.5 font-cairo text-sm text-espresso transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-stone/20 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Check className="h-4 w-4" strokeWidth={1.5} />
          )}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-stone/40 px-6 py-2.5 font-cairo text-sm font-medium text-charcoal transition-colors hover:bg-cream disabled:opacity-50"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

// ---------- Delete Confirmation Modal ----------

function DeleteConfirmModal({
  open,
  category,
  onConfirm,
  onCancel,
  deleting
}: {
  open: boolean;
  category: Category | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  if (!open || !category) return null;

  const productCount = category._count?.products ?? 0;

  return (
    <Modal open={open} onClose={onCancel} title="تأكيد الحذف">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-error/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" strokeWidth={1.5} />
          <div>
            <p className="font-cairo text-sm font-medium text-espresso">
              هل أنت متأكد من حذف هذا القسم؟
            </p>
            <p className="mt-1 font-cairo text-sm text-charcoal">
              القسم: <span className="font-bold">{category.title}</span>
            </p>
            {productCount > 0 && (
              <p className="mt-2 font-cairo text-sm font-medium text-error">
                تحذير: هذا القسم يحتوي على {productCount} منتج. لا يمكن حذفه إلا بعد نقل المنتجات.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-error px-5 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            )}
            حذف القسم
          </button>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-stone/40 px-5 py-2.5 font-cairo text-sm font-medium text-charcoal transition-colors hover:bg-cream disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Main Page ----------

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : data.data || data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      showToast('فشل في تحميل الأقسام', 'error');
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open create modal
  const handleCreate = () => {
    setFormData({
      ...emptyForm,
      sortOrder: categories.length > 0 ? Math.max(...categories.map((c) => c.sortOrder)) + 1 : 0
    });
    setEditingCategory(null);
    setModalMode('create');
  };

  // Open edit modal
  const handleEdit = (category: Category) => {
    setFormData({
      title: category.title,
      titleEn: category.titleEn || '',
      handle: category.handle || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      sortOrder: category.sortOrder ?? 0
    });
    setEditingCategory(category);
    setModalMode('edit');
  };

  // Close modal
  const handleCloseModal = () => {
    setModalMode(null);
    setEditingCategory(null);
    setFormData(emptyForm);
  };

  // Submit form (create or edit)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('اسم القسم مطلوب', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        titleEn: formData.titleEn.trim() || undefined,
        handle: formData.handle.trim() || undefined,
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        sortOrder: formData.sortOrder
      };

      if (modalMode === 'create') {
        await createCategory(payload);
        showToast('تم إنشاء القسم بنجاح', 'success');
      } else if (modalMode === 'edit' && editingCategory) {
        await updateCategory(editingCategory.id, payload);
        showToast('تم تحديث القسم بنجاح', 'success');
      }

      handleCloseModal();
      await fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      showToast(message, 'error');
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      showToast('تم حذف القسم بنجاح', 'success');
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في حذف القسم';
      showToast(message, 'error');
    }
    setDeleting(false);
  };

  // ---------- Render ----------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <ToastNotification toast={toast} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gold/15 rounded-xl p-2.5">
            <FolderTree className="h-6 w-6 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-cairo text-2xl font-bold text-espresso">إدارة الأقسام</h1>
            <p className="font-cairo text-sm text-warm-gray">{categories.length} قسم</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 self-start rounded-xl bg-gold px-5 py-2.5 font-cairo text-sm font-medium text-white shadow-warm transition-all hover:bg-gold-dark hover:shadow-warm-md"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={1.5} />
          إضافة قسم
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone/40 bg-white-warm py-16">
          <div className="rounded-full bg-cream p-4">
            <FolderTree className="h-10 w-10 text-warm-gray" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-cairo text-lg font-medium text-charcoal">لا توجد أقسام بعد</p>
          <p className="mt-1 font-cairo text-sm text-warm-gray">ابدأ بإضافة أول قسم لمتجرك</p>
          <button
            onClick={handleCreate}
            className="mt-5 flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-cairo text-sm font-medium text-white transition-colors hover:bg-gold-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            إضافة قسم
          </button>
        </div>
      )}

      {/* Category Cards Grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const productCount = category._count?.products ?? 0;

            return (
              <div
                key={category.id}
                className="group overflow-hidden rounded-2xl border border-stone/30 bg-white shadow-warm transition-all hover:shadow-warm-md"
              >
                {/* Image */}
                {category.imageUrl ? (
                  <div className="relative h-36 w-full overflow-hidden bg-cream">
                    <img
                      src={category.imageUrl}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center bg-cream/70">
                    <ImageIcon className="h-12 w-12 text-stone" strokeWidth={1} />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-cairo text-base font-bold text-espresso">{category.title}</h3>
                  {category.titleEn && (
                    <p className="mt-0.5 font-cairo text-sm text-warm-gray" dir="ltr">
                      {category.titleEn}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {category.handle && (
                      <span
                        className="rounded-lg bg-cream px-2.5 py-1 font-cairo text-xs text-charcoal"
                        dir="ltr"
                      >
                        /{category.handle}
                      </span>
                    )}
                    <span className="rounded-lg bg-gold/10 px-2.5 py-1 font-cairo text-xs font-medium text-gold-dark">
                      {productCount} منتج
                    </span>
                    <span className="flex items-center gap-1 rounded-lg bg-cream px-2.5 py-1 font-cairo text-xs text-warm-gray">
                      <GripVertical className="h-3 w-3" strokeWidth={1.5} />
                      {category.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="border-stone/15 mt-4 flex items-center gap-2 border-t pt-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone/30 px-3 py-2 font-cairo text-xs font-medium text-charcoal transition-colors hover:border-gold hover:bg-gold/5 hover:text-gold-dark"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeleteTarget(category)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone/30 px-3 py-2 font-cairo text-xs font-medium text-charcoal transition-colors hover:border-error hover:bg-error/5 hover:text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalMode !== null}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'إضافة قسم جديد' : 'تعديل القسم'}
      >
        <CategoryForm
          data={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          saving={saving}
          submitLabel={modalMode === 'create' ? 'إنشاء القسم' : 'حفظ التغييرات'}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteTarget !== null}
        category={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </div>
  );
}
