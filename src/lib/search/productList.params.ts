// src/lib/search/productList.params.ts
export type SortKey = 'newest' | 'price_asc' | 'price_desc';
export interface ProductListParams {
  q?: string;
  page?: number;      // 1-based
  limit?: number;     // ví dụ 12
  sort?: SortKey;
  category?: string;  // optional
}

const SORT_WHITELIST: Record<string, SortKey> = {
  newest: 'newest',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
};

export function parseProductListParams(input: Record<string, string | string[] | undefined>): Required<ProductListParams> {
  const pick = (k: string) => {
    const v = input[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const q = (pick('q') ?? '').trim();
  const page = Math.max(1, Number.parseInt(pick('page') ?? '1', 10) || 1);
  const limit = Math.min(60, Math.max(1, Number.parseInt(pick('limit') ?? '12', 10) || 12));
  const rawSort = (pick('sort') ?? 'newest').toLowerCase();
  const sort: SortKey = SORT_WHITELIST[rawSort] ?? 'newest';
  const category = (pick('category') ?? '').trim();

  return { q, page, limit, sort, category };
}

export function toURLSearchParams(p: ProductListParams) {
  const qs = new URLSearchParams();
  if (p.q) qs.set('q', p.q);
  if (p.category) qs.set('category', p.category);
  qs.set('page', String(p.page ?? 1));
  qs.set('limit', String(p.limit ?? 12));
  qs.set('sort', String(p.sort ?? 'newest'));
  return qs;
}
