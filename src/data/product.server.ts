import { IProduct } from '@/interfaces/IProduct';
import { fetchJson, buildUrl } from '@/lib/http';
import { TPaginatedResponse } from '@/types/response.type';

type FindProducts = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string; // vd: 'price.asc' | 'price.desc' | 'newest'
  category?: string;
  revalidate?: number;
};

export async function fetchProducts(params: FindProducts = {}) {
  const { q = '', page = 1, limit = 12, sort = '', category = '', revalidate = 60 } = params;
  const url = buildUrl(process.env.NEXT_PUBLIC_API!, '/api/products', { q, page, limit, sort, category });
  return fetchJson<TPaginatedResponse<IProduct>>(url, { revalidate });
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
