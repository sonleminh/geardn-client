import { useMutation, useQuery } from '@tanstack/react-query';
import { TBaseResponse } from '@/types/response.type';
import { ICartResponse, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { getCart, updateQty } from '@/apis/cart';
import { IUser } from '@/interfaces/IUser';

export function useGetCart(user: IUser | null) {
  return useQuery<TBaseResponse<ICartResponse>, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user
  });
}

export function useUpdateQuantity() {
  return useMutation<TBaseResponse<IUpdateQuantityResponse>, Error, IUpdateQuantityPayload>({
    mutationFn: updateQty,
  });
}
