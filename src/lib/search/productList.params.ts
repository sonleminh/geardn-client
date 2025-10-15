export type SortKey = 'newest' | 'price_asc' | 'price_desc';
export interface ProductListParams {
  q?: string;
  page?: number;     // 1-based
  limit?: number;
  sort?: SortKey;
  category?: string;
}

const SORT_WHITELIST: Record<string, SortKey> = {
  newest: 'newest',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
};

function pick(input: Record<string, string | string[] | undefined>, k: string) {
  const v = input[k];
  return Array.isArray(v) ? v[0] : v;
}

function parseIntMaybe(v?: string): number | undefined {
  if (v == null || v.trim() === '') return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parseProductListParams(
  input: Record<string, string | string[] | undefined>
): ProductListParams {
  const q = (pick(input, 'q') ?? '').trim() || undefined;

  const pageRaw = parseIntMaybe(pick(input, 'page'));
  const page = pageRaw && pageRaw > 0 ? pageRaw : undefined;

  const limitRaw = parseIntMaybe(pick(input, 'limit'));
  const limit = limitRaw && limitRaw > 0 ? limitRaw : undefined;

  const rawSort = (pick(input, 'sort') ?? '').toLowerCase();
  const sort = (SORT_WHITELIST[rawSort] as SortKey | undefined) ?? undefined;

  const category = (pick(input, 'category') ?? '').trim() || undefined;

  return { q, page, limit, sort, category };
}

export function toURLSearchParams(p: ProductListParams) {
  const qs = new URLSearchParams();
  if (p.q) qs.set('q', p.q);
  if (p.category) qs.set('category', p.category);
  if (p.sort) qs.set('sort', p.sort);
  if (p.page && p.page > 1) qs.set('page', String(p.page));   // bỏ page=1 để dùng default BE
  if (p.limit) qs.set('limit', String(p.limit));              // chỉ set khi user chọn cụ thể
  return qs;
}
