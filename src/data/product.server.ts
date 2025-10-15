import { headers } from 'next/headers';
import { IProduct } from '@/interfaces/IProduct';
import { TBaseResponse, TCursorPaginatedResponse, TPaginatedResponse } from '@/types/response.type';
import { ProductPage } from '@/apis/product';

// export async function getProducts(qs: URLSearchParams) {
//   console.log('qs1', qs);
//   const h = await headers();
//   const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
//   const r = await fetch(`${origin}/api/bff/products${qs.size?`?${qs.toString()}`:''}`, {
//     headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
//     cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
//   });
//   if (r.status === 404) return null;
//   if (!r.ok) throw new Error(`Product list fetch failed: ${r.status}`);
//   return r.json() as Promise<TPaginatedResponse<IProduct>>; 
// }

export async function getProducts(qs: URLSearchParams) {
  console.log('qs2-fetch-server', qs);
  console.log('qs2-fetch-server', qs.toString());
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products?${qs.toString()}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Product list fetch failed: ${r.status}`);
  return r.json() as Promise<TPaginatedResponse<IProduct>>; 
}


export async function getProductsByCategory(slug: string, qs: URLSearchParams) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products/category/${encodeURIComponent(slug)}${qs.size?`?${qs}`:''}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Product list fetch failed: ${r.status}`);
  return r.json() as Promise<TCursorPaginatedResponse<IProduct>>; 
}

export async function getProductBySlug(slug: string) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products/${encodeURIComponent(slug)}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`product fetch failed: ${r.status}`);
  return r.json() as Promise<TBaseResponse<IProduct>>; 
}