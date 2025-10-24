import { IProduct } from "@/interfaces/IProduct";
import { bff } from "@/lib/api-fetch";
import { NormalizedResponse, TBaseResponse, TCursorPaginatedResponse, TPaginatedResponse } from "@/types/response.type";

function buildQS(params: Record<string, string | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export type ProductPage = {
  items: IProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};

export const searchProducts = ( opts:{ sortBy:'createdAt'|'price' | ''; order:'asc'|'desc' | ''; limit?:string; cursor?:string;} ) => {
  const qs = buildQS({
    sortBy: opts.sortBy || undefined,
    order: opts.order || undefined,
    limit: opts.limit || undefined,
    cursor: opts.cursor,
  });
  return bff<NormalizedResponse<IProduct>>(
    `/api/bff/products/search${qs}`
  );
}

export const getProductsByCategory = (slug: string, opts:{ sortBy:'createdAt'|'price' | ''; order:'asc'|'desc' | ''; cursor?:string;} ) => {
  const qs = buildQS({
    sortBy: opts.sortBy || undefined,
    order: opts.order || undefined,
    cursor: opts.cursor,
  });
  return bff<TCursorPaginatedResponse<IProduct>>(
    `/api/bff/products/category/slug/${encodeURIComponent(slug)}${qs}`
  );
}

export const getProduct = (slug: string) => bff<TBaseResponse<IProduct>>(`/api/bff/products/${slug}`);
