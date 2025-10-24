import { getProduct, getProductsByCategory, searchProducts } from '@/apis/product';
import { IProduct } from '@/interfaces/IProduct';
import { TBaseResponse, TCursorPaginatedResponse } from '@/types/response.type';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export interface IGetProductByCateParams {
  limit?: number;
  sort?: 'asc' | 'desc' | '';
}

// export function useSearchProducts(initial: TPaginatedResponse<IProduct> | null, sp: URLSearchParams) {
//    const sortBy = (sp.get('sortBy') === 'price' ? 'price' : '') ;
//   const order = (sp.get('order') === 'asc' ? 'asc' : '');

//   return useQuery<TCursorPaginatedResponse<IProduct>, Error>({
//     queryKey: ['product', { sortBy, order }],
//     queryFn: () => getProducts({ sortBy, order }),
//     initialData: initial ?? undefined, 
//     staleTime: 0,
//     gcTime: 0,
//   });
// }

export function useSearchProductsInfinite(initial: TCursorPaginatedResponse<IProduct> | null, sp: URLSearchParams ) {
  const sortBy = (sp.get('sortBy') === 'price' ? 'price' : '') ;
  const order = (sp.get('order') === 'asc' ? 'asc' : '');
  const limit = '2';

  return useInfiniteQuery
  ({
    queryKey: ['products', { sortBy, order, limit }] as const,
    queryFn: ({ pageParam }) => searchProducts({ sortBy, order, limit, cursor: pageParam as string|undefined }),
    initialPageParam: undefined as string|undefined,
    getNextPageParam: (last) => last?.meta.nextCursor ?? undefined,
    initialData: initial ? { pages: [initial], pageParams: [undefined] } : undefined,
    staleTime: 0,
    select: d => {
      const pages = d.pages;
      const items = pages.flatMap(p => p.data);
      const last = pages.at(-1);
      return {
        items,
        meta: last?.meta ?? {},
      };
    },
  });
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

export function useProductsByCategoryInfinite(slug: string,initial: TCursorPaginatedResponse<IProduct> | null, sp: URLSearchParams ) {
  const sortBy = (sp.get('sortBy') === 'price' ? 'price' : '') ;
  const order = (sp.get('order') === 'asc' ? 'asc' : '');

  return useInfiniteQuery
  ({
    queryKey: ['cate-products', slug, { sortBy, order }] as const,
    queryFn: ({ pageParam }) => getProductsByCategory(slug, { sortBy, order, cursor: pageParam as string|undefined }),
    initialPageParam: undefined as string|undefined,
    getNextPageParam: (last) => last?.meta.nextCursor ?? undefined,
    initialData: initial ? { pages: [initial], pageParams: [undefined] } : undefined,
    staleTime: 0,
    select: d => {
      const pages = d.pages;
      const items = pages.flatMap(p => p.data);
      const last = pages.at(-1);
      const first = pages[0];
      return {
        items,
        meta: last?.meta ?? {},
        category: (last)?.category ?? (first)?.category ?? null,
      };
    },
  });
}