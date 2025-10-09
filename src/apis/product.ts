import { IProduct } from "@/interfaces/IProduct";
import { bff } from "@/lib/api-fetch";
import { TBaseResponse, TPaginatedResponse } from "@/types/response.type";

export const getProducts = (params: URLSearchParams) =>
  bff<TPaginatedResponse<IProduct>>(`/api/bff/products?${params.toString()}`);

export const getProduct = (slug: string) => bff<TBaseResponse<IProduct>>(`/api/bff/products/${slug}`);
