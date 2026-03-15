'use client';

import { useEffect, useState } from 'react';
import { getAdminPromos, createPromo, updatePromo, deletePromo } from '@/lib/admin-api';
import { Ticket, Plus, Pencil, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  usedCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  code: '',
  type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
  value: 0,
  minOrderAmount: 0,
  maxUsageCount: 0,
  validFrom: '',
  validUntil: '',
  isActive: true
};

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPromos();
  }, []);

  async function loadPromos() {
    setLoading(true);
    try {
      const data = await getAdminPromos();
      setPromos(Array.isArray(data) ? data : data.promoCodes || data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(promo: PromoCode) {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrderAmount: promo.minOrderAmount || 0,
      maxUsageCount: promo.maxUsageCount || 0,
      validFrom: promo.validFrom ? promo.validFrom.slice(0, 10) : '',
      validUntil: promo.validUntil ? promo.validUntil.slice(0, 10) : '',
      isActive: promo.isActive
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.code || !form.value) {
      setMessage({ type: 'error', text: 'يرجى ملء الكود والقيمة' });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        isActive: form.isActive
      };
      if (form.minOrderAmount) payload.minOrderAmount = Number(form.minOrderAmount);
      if (form.maxUsageCount) payload.maxUsageCount = Number(form.maxUsageCount);
      if (form.validFrom) payload.validFrom = new Date(form.validFrom).toISOString();
      if (form.validUntil) payload.validUntil = new Date(form.validUntil).toISOString();

      if (editingId) {
        await updatePromo(editingId, payload);
        setMessage({ type: 'success', text: 'تم تحديث الكود بنجاح' });
      } else {
        await createPromo(payload);
        setMessage({ type: 'success', text: 'تم إنشاء الكود بنجاح' });
      }
      setModalOpen(false);
      loadPromos();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'حدث خطأ' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
    try {
      await deletePromo(id);
      setMessage({ type: 'success', text: 'تم حذف الكود' });
      loadPromos();
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'فشل الحذف' });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-cairo text-2xl font-bold text-espresso">
          <Ticket className="h-6 w-6 text-gold" strokeWidth={1.5} />
          أكواد الخصم
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 font-cairo text-sm font-medium text-espresso transition-all hover:bg-gold-light hover:shadow-warm active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          كود جديد
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 font-cairo text-sm ${
            message.type === 'success'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-error/30 bg-error/10 text-error'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`rounded-xl border bg-white p-5 shadow-warm transition-shadow hover:shadow-warm-md ${
                promo.isActive ? 'border-stone/30' : 'border-stone/20 opacity-60'
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold tracking-wider text-espresso">
                    {promo.code}
                  </h3>
                  <p className="mt-1 font-cairo text-sm text-warm-gray">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${promo.value} د.م.`} خصم
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-cairo text-xs font-medium ${
                    promo.isActive ? 'bg-success/15 text-success' : 'bg-stone/20 text-warm-gray'
                  }`}
                >
                  {promo.isActive ? 'نشط' : 'معطل'}
                </span>
              </div>

              <div className="mb-4 space-y-1 font-cairo text-xs text-warm-gray">
                <p>
                  الاستخدام: {promo.usedCount}
                  {promo.maxUsageCount ? ` / ${promo.maxUsageCount}` : ''}
                </p>
                {promo.minOrderAmount ? <p>الحد الأدنى: {promo.minOrderAmount} د.م.</p> : null}
                {promo.validFrom && (
                  <p>من: {new Date(promo.validFrom).toLocaleDateString('ar-MA')}</p>
                )}
                {promo.validUntil && (
                  <p>إلى: {new Date(promo.validUntil).toLocaleDateString('ar-MA')}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(promo)}
                  className="hover:bg-gold/15 flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cream py-2 font-cairo text-xs font-medium text-charcoal transition-colors hover:text-gold-dark"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="hover:bg-error/15 flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-error/5 py-2 font-cairo text-xs font-medium text-error transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف
                </button>
              </div>
            </div>
          ))}
          {promos.length === 0 && (
            <div className="col-span-full py-12 text-center font-cairo text-sm text-warm-gray">
              لا توجد أكواد خصم
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-warm-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-cairo text-lg font-bold text-espresso">
                {editingId ? 'تعديل كود الخصم' : 'كود خصم جديد'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-warm-gray hover:text-espresso"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                  الكود *
                </label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="SUMMER20"
                  className="w-full rounded-lg border border-stone/40 px-3 py-2 font-mono text-sm uppercase tracking-wider text-espresso focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    النوع
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })
                    }
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  >
                    <option value="PERCENTAGE">نسبة مئوية %</option>
                    <option value="FIXED_AMOUNT">مبلغ ثابت د.م.</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    القيمة *
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    min={0}
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    الحد الأدنى للطلب
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    min={0}
                    placeholder="0"
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    حد الاستخدام
                  </label>
                  <input
                    type="number"
                    value={form.maxUsageCount}
                    onChange={(e) => setForm({ ...form, maxUsageCount: Number(e.target.value) })}
                    min={0}
                    placeholder="0 = غير محدود"
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-cairo text-sm font-medium text-charcoal">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full rounded-lg border border-stone/40 px-3 py-2 font-cairo text-sm text-espresso focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-cairo text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-stone accent-gold"
                />
                نشط
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-gold py-2.5 font-cairo font-medium text-espresso transition-all hover:bg-gold-light active:scale-[0.97] disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : editingId ? 'تحديث' : 'إنشاء'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-lg border border-stone/40 py-2.5 font-cairo text-sm text-charcoal transition-colors hover:bg-cream"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
