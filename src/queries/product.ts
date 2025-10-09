import { addCartItem, deleteCartItem, getCart, getCartStock, syncCart, updateQty } from '@/apis/cart';
import { getProduct } from '@/apis/product';
import { IAddCartItemPayload, ICartResponse, ICartStockItem, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { IProduct } from '@/interfaces/IProduct';
import { TBaseResponse } from '@/types/response.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetProduct(initialData?: TBaseResponse<IProduct> | null) {
  return useQuery<TBaseResponse<IProduct>, Error>({
    queryKey: ['product', initialData?.data?.slug ?? ''],
    queryFn: () => getProduct(initialData?.data.slug ?? ''),
    initialData: initialData ?? undefined, 
    staleTime: 0,
    gcTime: 0,
  });
}

export function useGetCartStock(skuIds: number[]) {
  const key = ['cart-stock', skuIds.slice().sort((a,b)=>a-b).join(',')];
  return useQuery<TBaseResponse<ICartStockItem[]>, Error>({
    queryKey: [key],
    queryFn: () => getCartStock(skuIds), 
    enabled: skuIds.length > 0,
  });
}

export function useSyncCart() {
  return useMutation<TBaseResponse<ICartResponse>, Error, ISyncCartPayload>({
    mutationFn: syncCart,
  });
}

export function useAddCartItem() {
  return useMutation<TBaseResponse<any>, Error, IAddCartItemPayload>({
    mutationFn: addCartItem,
  });
}

export function useUpdateQuantity() {
  return useMutation<TBaseResponse<IUpdateQuantityResponse>, Error, IUpdateQuantityPayload>({
    mutationFn: updateQty,
  });
}

export function useDeleteCartItem() {
  return useMutation<TBaseResponse<IUpdateQuantityResponse>, Error, number>({
    mutationFn: deleteCartItem,
  });
}