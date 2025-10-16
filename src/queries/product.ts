import { addCartItem, deleteCartItem, getCart, getCartStock, syncCart, updateQty } from '@/apis/cart';
import { ProductPage, getProduct, getProductsByCategory } from '@/apis/product';
import { IAddCartItemPayload, ICartResponse, ICartStockItem, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { ICategory } from '@/interfaces/ICategory';
import { IProduct } from '@/interfaces/IProduct';
import { TBaseResponse, TCursorPaginatedResponse, TPaginatedResponse } from '@/types/response.type';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export interface IGetProductByCateParams {
  limit?: number;
  sort?: 'asc' | 'desc' | '';
}


export function useGetProduct(initialData?: TBaseResponse<IProduct> | null) {
  return useQuery<TBaseResponse<IProduct>, Error>({
    queryKey: ['product', initialData?.data?.slug ?? ''],
    queryFn: () => getProduct(initialData?.data.slug ?? ''),
    initialData: initialData ?? undefined, 
    staleTime: 0,
    gcTime: 0,
  });
}

type CatResult = { items: IProduct[]; meta: { nextCursor?: string|null; hasMore?: boolean; total?: number }; category: ICategory | null; };

export function useProductsByCategoryInfinite(slug: string,initial: TCursorPaginatedResponse<IProduct> | null, qs: URLSearchParams, ) {
  return useInfiniteQuery<
  TCursorPaginatedResponse<IProduct>,      // TQueryFnData
    Error,                           // TError
    CatResult,
    [string, string, string | undefined],        // TQueryKey
    string | undefined               // TPageParam
  >({
    queryKey: ['cate-products', slug, qs.toString()],
    initialPageParam: undefined as string|undefined,
    initialData: initial ? { pages: [initial], pageParams: [undefined] } : undefined,
    queryFn: ({ pageParam }) => getProductsByCategory(slug, pageParam , new URLSearchParams(qs)),
    getNextPageParam: (last) => last?.meta.nextCursor ?? undefined,
    staleTime: 0,
    select: d => {
      const pages = d.pages;
      const items = pages.flatMap(p => p.data);
      const last = pages.at(-1);
      const first = pages[0];
      return {
        items,
        meta: last?.meta ?? {},
        // giữ category từ trang đầu nếu các trang sau không trả
        category: (last)?.category ?? (first)?.category ?? null,
      };
    },
  });
}