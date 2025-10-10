import { IProduct } from '@/interfaces/IProduct';
import { fetchJson, buildUrl } from '@/lib/http';
import { TBaseResponse, TPaginatedResponse } from '@/types/response.type';
import { headers } from 'next/headers';

type FindProducts = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  revalidate?: number;
};

type FindProductsByCategory = {
  category?: string;
  limit?: number;
  sort?: string;
  nextCursor?: string;
  revalidate?: number;
};

export type ProductPage = {
  items: IProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};


// export async function fetchProducts(params: FindProducts = {}) {
//   const { q = '', page = 1, limit = 9, sort = '', revalidate = 60 } = params;
//   const url = buildUrl(process.env.NEXT_PUBLIC_API!, '/products', { q, page, limit, sort });
//   return fetchJson<TPaginatedResponse<IProduct>>(url, { revalidate });
// }

// export async function fetchProductsByCategory(params: FindProductsByCategory = {}) {
//   const {  limit = 10, sort='', category = '', nextCursor = '', revalidate = 60 } = params;

//   const url = buildUrl(process.env.NEXT_PUBLIC_API!, `/products/category/slug/${category}`, { limit, sort, cursor: nextCursor });
//   return fetchJson<TBaseResponse<ProductPage>>(url, { revalidate });
// }

// export async function fetchProduct(params: { slug: string, revalidate?: number }) {
//   const { slug = '', revalidate = 60 } = params;
//   const url = buildUrl(process.env.NEXT_PUBLIC_API!, `/products/slug/${slug}`);
//   return fetchJson<TBaseResponse<IProduct>>(url, { revalidate });
// }

export async function getProducts(qs: URLSearchParams) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/products?${qs.toString()}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',                 // hoặc: next: { revalidate: 60 } nếu muốn ISR phía RSC
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`product fetch failed: ${r.status}`);
  return r.json() as Promise<TPaginatedResponse<IProduct>>; 
}

export async function getProductBySlug(slug: string) {
  console.log('slug getProductBySlug:', slug);
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


// import { env } from '@/env';
// import { IProduct } from '@/interfaces/IProduct';
// import { TBaseResponse, TPaginatedResponse } from '@/types/response.type';
// import { buildUrl } from '@/utils/buildURL';

// export type ProductPage = {
//   items: IProduct[];
//   nextCursor: string | null;
//   hasMore: boolean;
//   total: number;
// };


// export async function fetchProducts({ q = '', page = 1, sort = '', revalidate = 60 } = {}) {
//   const url = buildUrl(env.BACKEND_API_URL, '/api/products', { q, page, limit: 9, sort });
//   const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['products'] } });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<TPaginatedResponse<IProduct>>;
// }

// export async function fetchProductsByCategory({ slug = '', limit= 9, sort = '', cursor='', revalidate = 60 } = {}) {
//   const url = buildUrl(env.BACKEND_API_URL, `/api/products/category/${encodeURIComponent(slug)}`, { limit, sort, cursor });
//   const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['products'] } });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<TBaseResponse<ProductPage>>;
// }
