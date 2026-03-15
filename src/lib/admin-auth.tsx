'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens, getAdminProfile } from './admin-api';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refresh: async () => {}
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await getAdminProfile();
      // getAdminProfile already unwraps { data: {...} } -> returns user object directly
      const u = profile.user || profile;
      if (u.role === 'ADMIN') {
        setUser(u);
      } else {
        clearTokens();
        setUser(null);
      }
    } catch {
      clearTokens();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
