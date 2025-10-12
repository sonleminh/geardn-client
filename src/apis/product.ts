import { IProduct } from "@/interfaces/IProduct";
import { bff } from "@/lib/api-fetch";
import { TBaseResponse, TCursorPaginatedResponse, TPaginatedResponse } from "@/types/response.type";

export type ProductPage = {
  items: IProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};

export const getProducts = (params: URLSearchParams) =>
  bff<TPaginatedResponse<IProduct>>(`/api/bff/products?${params.toString()}`);

export const getProductsByCategory = (slug: string, cursor?: string, limit = 3) => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('limit', String(limit));

  return bff<TCursorPaginatedResponse<IProduct>>(
    `/api/bff/products/category/${encodeURIComponent(slug)}?${params.toString()}`
  );
}

export const getProduct = (slug: string) => bff<TBaseResponse<IProduct>>(`/api/bff/products/${slug}`);
