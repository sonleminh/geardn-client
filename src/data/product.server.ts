import { IProduct } from '@/interfaces/IProduct';
import { TPaginatedResponse } from '@/types/response.type';
import 'server-only';
const API = process.env.API_URL!;

export async function fetchProducts({ q = '', page = 1, limit = 9, revalidate = 60 } = {}) {
  const url = new URL('/api/products', API);
  url.searchParams.set('q', q);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  console.log(url);
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['products'] } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TPaginatedResponse<IProduct>>;
}
