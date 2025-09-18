import { ICategory } from '@/interfaces/ICategory';
import { TPaginatedResponse } from '@/types/response.type';
import { buildUrl } from '@/utils/buildURL';
import 'server-only';
const API = process.env.API_URL!;

export async function fetchCategories({ revalidate = 60 } = {}) {
  const url = buildUrl(API, '/api/categories');
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate, tags: ['categories'] } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TPaginatedResponse<ICategory>>;
}
