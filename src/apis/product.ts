import { IProduct } from "@/interfaces/IProduct";
import { bff } from "@/lib/api-fetch";
import { IGetProductByCateParams } from "@/queries/product";
import { TBaseResponse, TCursorPaginatedResponse, TPaginatedResponse } from "@/types/response.type";

export type ProductPage = {
  items: IProduct[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};

// export const getProducts = (params: URLSearchParams) =>
//   bff<TPaginatedResponse<IProduct>>(`/api/bff/products?${params.toString()}`);

export const getProductsByCategory = (slug: string,cursor: string | undefined, params: URLSearchParams, ) => {
  // console.log('pr', pr); 
  console.log('params', params); 
  // if (cursor) params.set('cursor', cursor);
  // pr.set('limit', String(2));
  return bff<TCursorPaginatedResponse<IProduct>>(
    `/api/bff/products/category/${encodeURIComponent(slug)}${params.size?`?${params}`:''}}`
  );
}

export const getProduct = (slug: string) => bff<TBaseResponse<IProduct>>(`/api/bff/products/${slug}`);
