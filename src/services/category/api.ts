import { getRequest } from '@/utils/fetch-client';
import { ICategory } from '@/interfaces/ICategory';

export type TCategoriesRes = {
  data: ICategory[];
  total: number;
};

const categoryUrl = 'categories'

export async function getCategoryListApi () {
  const res: TCategoriesRes = await getRequest(`/${categoryUrl}`);
  return res.data;
};