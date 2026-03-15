const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://konouz-backend.onrender.com/api/v1';

// ---------- Token helpers ----------
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('admin_access_token', access);
  localStorage.setItem('admin_refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
}

// ---------- Fetch wrapper with auto-refresh ----------
async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Don't set Content-Type for FormData (browser sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // If 401, try refresh
  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (refreshRes.ok) {
        const rJson = await refreshRes.json();
        const data = rJson.data || rJson;
        setTokens(data.accessToken, data.refreshToken);
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        res = await fetch(`${API_URL}${path}`, { ...options, headers });
      } else {
        clearTokens();
      }
    }
  }

  return res;
}

// Unwrap { success, data: {...}, meta?: {...} } pattern from API responses
// If response has meta (pagination), merge it with data for list endpoints
async function unwrap(res: Response) {
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // API returned HTML instead of JSON (e.g. Render cold start, 404 page)
    throw new Error(
      res.status === 404
        ? 'المورد غير موجود'
        : `خطأ في الخادم (${res.status}). يرجى المحاولة مرة أخرى.`
    );
  }
  if (!res.ok) throw new Error(json.message || json.error || 'Request failed');
  const data = json.data !== undefined ? json.data : json;
  // For paginated list responses, return { data: [...], ...meta }
  if (json.meta && Array.isArray(data)) {
    return { data, ...json.meta };
  }
  return data;
}

// ---------- Auth ----------
export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || 'Login failed');
  // API may wrap response in { success, data: {...} }
  const data = json.data || json;
  if (data.user?.role !== 'ADMIN') {
    throw new Error('ليس لديك صلاحيات الإدارة');
  }
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function getAdminProfile() {
  const res = await adminFetch('/auth/me');
  if (!res.ok) throw new Error('Not authenticated');
  const json = await res.json();
  return json.data || json;
}

// ---------- Analytics ----------
export async function getAnalyticsOverview() {
  return unwrap(await adminFetch('/admin/analytics/overview'));
}

export async function getRevenueData(days = 30) {
  return unwrap(await adminFetch(`/admin/analytics/revenue?days=${days}`));
}

export async function getBestSellers(limit = 10) {
  return unwrap(await adminFetch(`/admin/analytics/best-sellers?limit=${limit}`));
}

export async function getOrdersByStatus() {
  return unwrap(await adminFetch('/admin/analytics/orders'));
}

export async function getLowStockProducts(threshold = 5) {
  return unwrap(await adminFetch(`/admin/analytics/low-stock?threshold=${threshold}`));
}

// ---------- Products ----------
export async function getAdminProducts(
  params: { page?: number; limit?: number; q?: string; category?: string } = {}
) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  return unwrap(await adminFetch(`/admin/products?${query}`));
}

export async function getAdminProduct(id: string) {
  return unwrap(await adminFetch(`/admin/products/${id}`));
}

export async function createProduct(data: Record<string, unknown>) {
  return unwrap(
    await adminFetch('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  );
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  return unwrap(
    await adminFetch(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  );
}

export async function deleteProduct(id: string) {
  return unwrap(await adminFetch(`/admin/products/${id}`, { method: 'DELETE' }));
}

export async function uploadProductImages(productId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  return unwrap(
    await adminFetch(`/admin/products/${productId}/images`, {
      method: 'POST',
      body: formData
    })
  );
}

export async function deleteProductImage(productId: string, imageId: string) {
  return unwrap(
    await adminFetch(`/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE'
    })
  );
}

// ---------- Categories ----------
export async function getAdminCategories() {
  return unwrap(await adminFetch('/admin/categories'));
}

export async function createCategory(data: Record<string, unknown>) {
  return unwrap(
    await adminFetch('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  );
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return unwrap(
    await adminFetch(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  );
}

export async function deleteCategory(id: string) {
  return unwrap(await adminFetch(`/admin/categories/${id}`, { method: 'DELETE' }));
}

// ---------- Orders ----------
export async function getAdminOrders(
  params: { page?: number; limit?: number; status?: string } = {}
) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  return unwrap(await adminFetch(`/admin/orders?${query}`));
}

export async function getAdminOrder(id: string) {
  return unwrap(await adminFetch(`/admin/orders/${id}`));
}

export async function updateOrderStatus(id: string, status: string) {
  return unwrap(
    await adminFetch(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  );
}

// ---------- Customers ----------
export async function getAdminCustomers(params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  return unwrap(await adminFetch(`/admin/customers?${query}`));
}

export async function getAdminCustomer(id: string) {
  return unwrap(await adminFetch(`/admin/customers/${id}`));
}

// ---------- Promo Codes ----------
export async function getAdminPromos() {
  return unwrap(await adminFetch('/admin/promo'));
}

export async function createPromo(data: Record<string, unknown>) {
  return unwrap(
    await adminFetch('/admin/promo', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  );
}

export async function updatePromo(id: string, data: Record<string, unknown>) {
  return unwrap(
    await adminFetch(`/admin/promo/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  );
}

export async function deletePromo(id: string) {
  return unwrap(await adminFetch(`/admin/promo/${id}`, { method: 'DELETE' }));
}
