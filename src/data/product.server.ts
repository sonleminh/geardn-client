import { headers } from 'next/headers';
import { IProduct } from '@/interfaces/IProduct';
// import { PaginatedResponse, ProductsByCategoryResponse, ApiResponse, SearchProductsResponse } from '@/types/response.type';
import { safeJson, toErrorResult } from '@/lib/http';
import { BaseResponse, NormalizedResponse, PageListResponse } from '@/types/response.type';

export type PageMeta = { total: number; page: number; pageSize: number }

export async function getProducts(qs: URLSearchParams) {
 const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products?${qs.toString()}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Product list fetch failed: ${r.status}`);
  return r.json() as Promise<PageListResponse<IProduct>>;
}

export async function searchProducts(qs: URLSearchParams) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products/search?${qs.toString()}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Search products fetch failed: ${r.status}`);
  return r.json() as Promise<NormalizedResponse<IProduct>>; 
}



export async function getProductsByCategory(slug: string, qs?: URLSearchParams) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  console.log('slug', slug)
  const r = await fetch(`${origin}/api/bff/products/category/slug/${encodeURIComponent(slug)}${qs?.size?`?${qs}`:''}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Product list fetch failed: ${r.status}`);
  return r.json(); 
  // return r.json() as Promise<ProductsByCategoryResponse<IProduct>>; 
}

export async function getProductBySlug(slug: string) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products/slug/${encodeURIComponent(slug)}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`product fetch failed: ${r.status}`);
  return r.json() as Promise<BaseResponse<IProduct>>; 
}