import { getRequest } from '@/utils/fetch-client';
import { IProduct } from '@/interfaces/IProduct';

export type TProductsRes = {
  data: IProduct[];
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

export async function getProductBySlug(slug: string) {
  const res: TProductRes = await getRequest(`/${productUrl}/slug/${slug}`);
  return res;
};

export async function getPrdByCateSlug(slug:string, page?: string, sort?: string) {
  const res: TProductsRes = await getRequest(`/${productUrl}/category/${slug}?${page ? `page=${page}` : ''}${sort ? `&sort=${sort}` : ''}`);
  return res;
};