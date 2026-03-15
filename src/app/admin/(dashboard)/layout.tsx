'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState, ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/categories', label: 'الأقسام', icon: FolderTree },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'العملاء', icon: Users },
  { href: '/admin/promos', label: 'أكواد الخصم', icon: Ticket },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 }
];

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-64 flex-col bg-espresso text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal p-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo_icon.png"
              alt="كنوز"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <h2 className="font-cairo text-sm font-bold text-white">كنوز</h2>
              <p className="font-cairo text-xs text-warm-gray">لوحة التحكم</p>
            </div>
          </div>
          <button onClick={onClose} className="text-warm-gray hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 font-cairo text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gold/15 font-medium text-gold'
                        : 'text-stone hover:bg-charcoal hover:text-white'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-charcoal p-4">
          {user && (
            <div className="mb-3 font-cairo text-xs text-warm-gray">
              {user.firstName} {user.lastName}
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-cairo text-sm text-stone transition-colors hover:bg-error/10 hover:text-error"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone/30 bg-white-warm px-4 py-3 shadow-warm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-charcoal hover:text-gold lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-cairo text-sm text-warm-gray">
            مرحباً، <span className="font-medium text-charcoal">{user.firstName}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-stone/40 px-3 py-1.5 font-cairo text-xs text-charcoal transition-colors hover:border-gold hover:text-gold"
          >
            عرض المتجر
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
