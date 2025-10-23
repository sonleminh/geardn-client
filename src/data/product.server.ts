import { headers } from 'next/headers';
import { IProduct } from '@/interfaces/IProduct';
// import { PaginatedResponse, ProductsByCategoryResponse, ApiResponse, SearchProductsResponse } from '@/types/response.type';
import { safeJson, toErrorResult } from '@/lib/http';
import { PageListResponse } from '@/types/response.type';

export type PageMeta = { total: number; page: number; pageSize: number }

export async function getProducts(qs: URLSearchParams) {
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`
  const url = `${origin}/api/bff/products${qs.size ? `?${qs.toString()}` : ''}`
  
  
  try {
    const r = await fetch(url, { headers:{ cookie: h.get('cookie') ?? '', accept:'application/json' }, cache:'no-store' });
    if (r.status === 404) return { ok: false, notFound: true } as const;
    const data = await r.json().catch(() => null);
    if (!r.ok) return { ok: false, status: r.status, message: data?.message ?? `HTTP ${r.status}` } as const;
    return data as Promise<PageListResponse<IProduct>>;
  } catch {
    // BE down / network error
    return { ok: false, status: 503, message: 'Service temporarily unavailable' } as const;
  }
}
// export async function getProducts(qs: URLSearchParams) {
//   const h = await headers();
//   const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
//   let r: Response;
//   try {
//     r = await fetch(`${origin}/api/bff/products?${qs.toString()}`, {
//       headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
//       cache: 'no-store',
//     });
//   } catch (e) {
//     // Lỗi mạng phía RSC khi gọi BFF: map về 502
//     return { success: false, status: 502, message: e instanceof Error ? e.message : 'Bad Gateway' };
//   }
//   if (r.status === 404) {
//     // Tùy bạn: có thể trả ok:true với data rỗng để UI đồng nhất
//     return toErrorResult(404, { message: 'Not Found' });
//   }

//   const payload = await safeJson(r);

//   if (!r.ok) {
//     // Giữ nguyên status từ proxy (502/504/500/4xx)
//     return toErrorResult(r.status, payload, 'Upstream error');
//   }

//   return { ok: true, data: payload as PaginatedResponse<IProduct> };
// }

export async function searchProducts(qs: URLSearchParams) {
  console.log('qs(fetch-server)', qs.toString());
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products/search?${qs.toString()}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Search products fetch failed: ${r.status}`);
  return r.json() as Promise<SearchProductsResponse<IProduct>>; 
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
  return r.json() as Promise<ApiResponse<IProduct>>; 
}