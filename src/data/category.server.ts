import { headers } from 'next/headers';
import { ICategory } from '@/interfaces/ICategory';
import { TPaginatedResponse } from '@/types/response.type';

export async function getCategories() {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/categories`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Category list fetch failed: ${r.status}`);
  return r.json() as Promise<TPaginatedResponse<ICategory>>; 
}