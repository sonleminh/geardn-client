import { getRequest } from '@/utils/fetch-client';
import { IProduct } from '@/interfaces/IProduct';

export type TProductsRes = {
  products: IProduct[];
  total: number;
  status: boolean;
  message: string;
};

export type TProductRes = {
  data: IProduct;
  status: boolean;
  message: string;
};

const productUrl = 'products'

export async function getProductListApi (page?: string, sort?: string) {
  const res: TProductsRes = await getRequest(`/${productUrl}?${page ? `page=${page}` : ''}&limit=9${sort ? `&sort=${sort}` : ''}`);
  return res;
};

export async function useGetProductBySlug(slug: string) {
  const res: TProductRes = await getRequest(`/${productUrl}/slug/${slug}`);
  return res;
};

export const useGetCategories = () => {
  const res = getRequest(`/categories`);
  // return {
  //   categories: data as TCategoriesRes,
  //   isLoading,
  //   isError: error,
  // };
};

export async function getPrdByCateSlug(slug:string, page?: string, sort?: string) {
  const res: TProductsRes = await getRequest(`/${productUrl}/category/${slug}?${page ? `page=${page}` : ''}${sort ? `&sort=${sort}` : ''}`);
  return res;
};