import { IProduct } from '@/interfaces/IProduct';
import { TPaginatedResponse } from '@/types/response.type';
import { buildUrl } from '@/utils/buildURL';
import 'server-only';

const API_URL = process.env.API_URL!;

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export async function fetchProducts({
  page = 1,
  limit = 12,
  search = '',
  sort = '',
  revalidate = 60,
}: ProductListParams & { revalidate?: number } = {}) {
  const url = buildUrl(API_URL, '/api/products', {
    page,
    limit,
    search,
    sort,
  });

  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    next: { revalidate, tags: ['products'] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return res.json() as Promise<TPaginatedResponse<IProduct>>;
}
