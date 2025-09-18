import { IProduct } from '@/interfaces/IProduct';
import { TBaseResponse, TPaginatedResponse } from '@/types/response.type';
import { buildUrl } from '@/utils/buildURL';
const API = process.env.BACKEND_API_URL!;

export type ProductPage = {
  items: IProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};


export async function fetchProducts({ q = '', page = 1, sort = '', revalidate = 60 } = {}) {
  const limit = 9;
  const url = buildUrl(API, '/api/products', { q, page, limit, sort });
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['products'] } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TPaginatedResponse<IProduct>>;
}

export async function fetchProductsByCategory({ slug = '', limit= 9, sort = '', cursor='', revalidate = 60 } = {}) {
  const url = buildUrl(API, `/api/products/category/${encodeURIComponent(slug)}`, { limit, sort, cursor });
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['products'] } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TBaseResponse<ProductPage>>;
}
