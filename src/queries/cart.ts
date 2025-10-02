import { useMutation, useQuery } from '@tanstack/react-query';
import { TBaseResponse } from '@/types/response.type';
import { IAddCartItemPayload, ICartResponse, ICartStockItem, ICartStockResponse, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { addCartItem, deleteCartItem, getCart, getCartStock, syncCart, updateQty } from '@/apis/cart';
import { IUser } from '@/interfaces/IUser';

export function useGetCart(user: IUser | null) {
  return useQuery<TBaseResponse<ICartResponse>, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user
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