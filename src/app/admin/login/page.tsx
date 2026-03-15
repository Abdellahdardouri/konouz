'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/admin-api';
import Image from 'next/image';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-espresso via-charcoal to-espresso p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo_icon.png"
            alt="كنوز"
            width={80}
            height={80}
            className="mb-4"
            priority
          />
          <h1 className="font-cairo text-2xl font-bold text-white">لوحة تحكم كنوز</h1>
          <p className="mt-1 font-cairo text-sm text-stone">تسجيل دخول المسؤول</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-charcoal bg-espresso/80 p-8 shadow-warm-xl backdrop-blur-sm"
        >
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block font-cairo text-sm font-medium text-stone">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 h-4 w-4 text-warm-gray -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@konouz.ma"
                className="w-full rounded-lg border border-charcoal bg-charcoal/50 py-3 pl-4 pr-10 font-cairo text-sm text-white placeholder-warm-gray transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-cairo text-sm font-medium text-stone">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 h-4 w-4 text-warm-gray -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-charcoal bg-charcoal/50 py-3 pl-10 pr-10 font-cairo text-sm text-white placeholder-warm-gray transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 text-warm-gray transition-colors -translate-y-1/2 hover:text-gold"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-3 font-cairo font-bold text-espresso transition-all duration-200 hover:bg-gold-light hover:shadow-warm-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-espresso/30 border-t-espresso" />
                جاري الدخول...
              </span>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-cairo text-xs text-warm-gray">
          © {new Date().getFullYear()} كنوز — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
