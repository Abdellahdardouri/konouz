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
  X,
  MoreHorizontal
} from 'lucide-react';
import { useState, ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/categories', label: 'الأقسام', icon: FolderTree },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'العملاء', icon: Users },
  { href: '/admin/promos', label: 'الخصم', icon: Ticket },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 }
];

// Bottom nav shows first 4 items + "more" button
const bottomNavItems = navItems.slice(0, 4);
const moreNavItems = navItems.slice(4);

function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <aside className="hidden h-screen w-64 flex-col bg-espresso text-white lg:flex">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-charcoal p-5">
        <Image src="/images/logo_icon.png" alt="كنوز" width={40} height={40} className="rounded-xl" />
        <div>
          <h2 className="font-cairo text-sm font-bold text-white">كنوز</h2>
          <p className="font-cairo text-xs text-warm-gray">لوحة التحكم</p>
        </div>
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
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* "More" dropdown */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
          <div className="fixed bottom-16 left-4 z-50 rounded-xl border border-stone/30 bg-white py-2 shadow-warm-lg">
            {moreNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 px-5 py-2.5 font-cairo text-sm ${
                    isActive ? 'font-medium text-gold' : 'text-charcoal'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}
            <div className="mx-4 my-1 border-t border-stone/20" />
            <Link
              href="/"
              target="_blank"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 px-5 py-2.5 font-cairo text-sm text-charcoal"
            >
              <Package className="h-4 w-4" strokeWidth={1.5} />
              عرض المتجر
            </Link>
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone/20 bg-white shadow-warm-lg lg:hidden">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${
                  isActive ? 'text-gold' : 'text-warm-gray'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="font-cairo text-[10px]">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${
              moreOpen || moreNavItems.some((i) => pathname.startsWith(i.href))
                ? 'text-gold'
                : 'text-warm-gray'
            }`}
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-cairo text-[10px]">المزيد</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function MobileTopBar() {
  const { user, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone/30 bg-white px-4 py-2.5 shadow-warm lg:hidden">
      <div className="flex items-center gap-2">
        <Image src="/images/logo_icon.png" alt="كنوز" width={28} height={28} className="rounded-lg" />
        <span className="font-cairo text-sm font-bold text-espresso">كنوز</span>
      </div>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-cream px-2.5 py-1.5 font-cairo text-xs text-charcoal"
        >
          {user?.firstName}
          <Menu className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-stone/30 bg-white py-1 shadow-warm-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 font-cairo text-sm text-error"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                خروج
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function DesktopTopBar() {
  const { user } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-stone/30 bg-white-warm px-6 py-3 shadow-warm lg:flex">
      <div className="font-cairo text-sm text-warm-gray">
        مرحباً، <span className="font-medium text-charcoal">{user?.firstName}</span>
      </div>
      <Link
        href="/"
        target="_blank"
        className="rounded-lg border border-stone/40 px-3 py-1.5 font-cairo text-xs text-charcoal transition-colors hover:border-gold hover:text-gold"
      >
        عرض المتجر
      </Link>
    </header>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
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
      {/* Desktop: sidebar */}
      <DesktopSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile: top bar with logo + user */}
        <MobileTopBar />
        {/* Desktop: top bar with greeting */}
        <DesktopTopBar />

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 p-3 pb-20 sm:p-4 lg:p-6 lg:pb-6">{children}</main>
      </div>

      {/* Mobile: bottom navigation */}
      <MobileBottomNav />
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
