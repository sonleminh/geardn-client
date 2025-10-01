import { useMutation, useQuery } from '@tanstack/react-query';
import { TBaseResponse } from '@/types/response.type';
import { ICartResponse, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { getCart, syncCart, updateQty } from '@/apis/cart';
import { IUser } from '@/interfaces/IUser';

export function useGetCart(user: IUser | null) {
  return useQuery<TBaseResponse<ICartResponse>, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user
  });
}

export function useSyncCart() {
  return useMutation<TBaseResponse<ICartResponse>, Error, ISyncCartPayload>({
    mutationFn: syncCart,
  });
}
export function useUpdateQuantity() {
  return useMutation<TBaseResponse<IUpdateQuantityResponse>, Error, IUpdateQuantityPayload>({
    mutationFn: updateQty,
  });
}
