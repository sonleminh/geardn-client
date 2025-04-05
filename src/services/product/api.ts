import { getRequest } from '@/utils/fetch-client';
import { IProduct } from '@/interfaces/IProduct';
import { TPaginatedResponse } from '@/types/response.type';

export type TProductRes = {
  data: IProduct;
  status: boolean;
  message: string;
};

const productUrl = 'products'

export async function getProductList(page?: string, sort?: string) {
  const res = await getRequest(`/${productUrl}?${page ? `page=${page}` : ''}&limit=9${sort ? `&sort=${sort}` : ''}`);
  return res as TPaginatedResponse<IProduct>;
};

export async function getProductBySlug(slug: string) {
  const res: TProductRes = await getRequest(`/${productUrl}/slug/${slug}`);
  return res;
};

export async function getPrdByCateSlug(slug:string, page?: string, sort?: string) {
  // const res: TProductsRes = await getRequest(`/${productUrl}/category/${slug}`);
  const res: TProductRes = await getRequest(`/${productUrl}/slug/${slug}`);
  // const res: TProductsRes = await getRequest(`/${productUrl}/category/${slug}?${page ? `page=${page}` : ''}${sort ? `&sort=${sort}` : ''}`);
  return res;
};