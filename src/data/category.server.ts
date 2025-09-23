import { ICategory } from '@/interfaces/ICategory';
import { buildUrl, fetchJson } from '@/lib/http';
import { TPaginatedResponse } from '@/types/response.type';
import 'server-only';

export async function fetchCategories({ revalidate = 60 } = {}) {
  const url = buildUrl(process.env.NEXT_PUBLIC_API!, '/categories');
  return fetchJson<TPaginatedResponse<ICategory>>(url, { revalidate });
}
