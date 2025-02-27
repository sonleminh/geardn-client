import { getRequest } from '@/utils/fetch-client';

export type TCategoriesRes = {
  categories: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  }[];
  total: number;
};

const categoryUrl = 'categories'

export async function getCategoryListApi () {
  const res: TCategoriesRes = await getRequest(`/${categoryUrl}`);
  return res;
};

export const useGetSKUByPrdId = (id: string) => {
  const res = getRequest(`/product-sku/product/${id}`);
  // return {
  //   skuList: data as ISku[],
  //   isLoading,
  //   isError: error,
  // };
};