// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL, SERVER_API_URL } from '@/constants/env';
import { ILogInResponse, ILogoutResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';
import { getRequest, postRequest } from '@/utils/fetch-client';
import { fetcher } from '../fetcher';
import { IProduct } from '@/interfaces/IProduct';
import { ISku } from '@/interfaces/ISku';
import { IQuery } from '@/interfaces/IQuery';
import queryString from 'query-string';

export type TProductsRes = {
  products: IProduct[];
  total: number;
};

const productUrl = 'products'

export async function getProductListApi (page?: string) {
  const res: TProductsRes = await getRequest(`/${productUrl}?${page ? `page=${page}` : ''}&limit=9`);
  return res;
};

export const useGetProductBySlug = (slug: string) => {
  const res = getRequest(`/${productUrl}/slug/${slug}`);
  // return {
  //   product: data as IProduct,
  //   isLoading,
  //   isError: error,
  // };
};

export const useGetSKUByPrdId = (id: string) => {
  const res = getRequest(`/product-sku/product/${id}`);
  // return {
  //   skuList: data as ISku[],
  //   isLoading,
  //   isError: error,
  // };
};

export const useGetCategories = () => {
  const res = getRequest(`/categories`);
  // return {
  //   categories: data as TCategoriesRes,
  //   isLoading,
  //   isError: error,
  // };
};

export const getPrdByCateSlug = async (slug:string) => {
//   try {
//     // console.log(slug)
//     // const result = await fetch(
//     //   `http://localhost:3000/gia-treo-man-hinh/api`
//     //   // `${SERVER_API_URL}/${slug}/api`
//     // ).then((res) => res.json());
//     const result = await getRequest(
//       `${SERVER_API_URL}/${slug}/api`
//     )
//   return result as IProduct[];
// } catch (error) {
//    throw new Error('Failed to fetch article list by ID API') 
//   }
};