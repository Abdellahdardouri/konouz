'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function useIsAdmin() {
  const pathname = usePathname();
  return pathname.startsWith('/admin');
}

export function HideOnAdmin({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  if (isAdmin) return null;
  return <>{children}</>;
}

export function ShowOnAdmin({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return <>{children}</>;
}

/**
 * Same as HideOnAdmin but uses CSS to avoid hydration mismatch
 * when wrapping server components like Header.
 */
export function HideOnAdminCSS({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  return <div style={isAdmin ? { display: 'none' } : undefined}>{children}</div>;
}
