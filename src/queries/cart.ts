import { addCartItem, deleteCartItem, getCart, getCartStock, syncCart, updateQty } from '@/apis/cart';
import { IAddCartItemPayload, ICartResponse, ICartStockItem, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { IUser } from '@/interfaces/IUser';
import { TBaseResponse } from '@/types/response.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetCart(user: IUser | null) {
  return useQuery<TBaseResponse<ICartResponse>, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user,
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