import { TAGS } from '@/lib/constants';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Cart, Collection, Menu, Page, Product } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'API error');
  }
  return json.data;
}

export async function createCart(): Promise<Cart> {
  return apiFetch<Cart>('/cart', {
    method: 'POST',
    cache: 'no-store'
  });
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({ lines }),
    cache: 'no-store'
  });
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${cartId}/items`, {
    method: 'DELETE',
    body: JSON.stringify({ lineIds }),
    cache: 'no-store'
  });
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${cartId}/items`, {
    method: 'PATCH',
    body: JSON.stringify({ lines }),
    cache: 'no-store'
  });
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  try {
    return await apiFetch<Cart>(`/cart/${cartId}`, { cache: 'no-store' });
  } catch {
    return undefined;
  }
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  try {
    return await apiFetch<Collection>(`/categories/${handle}`);
  } catch {
    return undefined;
  }
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  first = 100
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  first?: number;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (sortKey) params.set('sortKey', sortKey);
  if (reverse) params.set('reverse', 'true');
  if (first) params.set('first', String(first));

  return apiFetch<Product[]>(`/categories/${collection}/products?${params.toString()}`);
}

export async function getCollections(): Promise<Collection[]> {
  return apiFetch<Collection[]>('/categories');
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return apiFetch<Menu[]>(`/menu/${handle}`);
}

export async function getPage(handle: string): Promise<Page> {
  // Static pages - no backend endpoint needed for now
  return {
    id: handle,
    title: handle === 'about-us' ? 'من نحن' : handle,
    handle,
    body: '',
    bodySummary: '',
    seo: { title: handle, description: '' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as Page;
}

export async function getPages(): Promise<Page[]> {
  return [];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    return await apiFetch<Product>(`/products/${handle}`);
  } catch {
    return undefined;
  }
}

export async function getProductRecommendations(productId: string, first = 3): Promise<Product[]> {
  try {
    // productId here is actually the handle from the product page
    return await apiFetch<Product[]>(`/products/${productId}/recommendations?first=${first}`);
  } catch {
    return [];
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  first = 100
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  first?: number;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (sortKey) params.set('sortKey', sortKey);
  if (reverse) params.set('reverse', 'true');
  if (first) params.set('first', String(first));

  return apiFetch<Product[]>(`/products?${params.toString()}`);
}

// Revalidation webhook (kept for potential future use)
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) revalidateTag(TAGS.collections);
  if (isProductUpdate) revalidateTag(TAGS.products);

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
