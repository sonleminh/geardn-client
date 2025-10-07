import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder, getUserPurchases } from '@/apis/order';
import { TBaseResponse } from '@/types/response.type';
import { ICreateOrderPayload, IOrder } from '@/interfaces/IOrder';
import { OrderStatus } from '@/constants/orderStatus';

export function useCreateOrder() {
  return useMutation<TBaseResponse<IOrder>, Error, ICreateOrderPayload>({
    mutationFn: createOrder,
  });
}


export function useUserPurchases(p :{type: number}) {
  return useQuery({
    queryKey: ['user-purchases', p.type],
    queryFn: () => getUserPurchases(p),
  });
}