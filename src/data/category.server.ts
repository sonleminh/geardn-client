import { headers } from 'next/headers';
import { ICategory } from '@/interfaces/ICategory';
import { BaseResponse, PageListResponse} from '@/types/response.type';

export async function getCategoryBySlug(slug: string) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/categories/${encodeURIComponent(slug)}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Category fetch failed: ${r.status}`);
  return r.json() as Promise<BaseResponse<ICategory>>; 
}

export async function getCategories() {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const url = `${origin}/api/bff/categories`

  try {
    const r = await fetch(url, { headers:{ cookie: h.get('cookie') ?? '', accept:'application/json' }, cache:'no-store' });
    if (r.status === 404) return { ok: false, notFound: true } as const;
    const data = await r.json().catch(() => null);
    if (!r.ok) return { ok: false, status: r.status, message: data?.message ?? `HTTP ${r.status}` } as const;
    return data as Promise<PageListResponse<ICategory>>;
  } catch {
    // BE down / network error
    return { ok: false, status: 503, message: 'Service temporarily unavailable' } as const;
  }
}