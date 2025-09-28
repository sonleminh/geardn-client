import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/apis/order';
import { TBaseResponse } from '@/types/response.type';
import { ICreateOrderPayload, IOrder } from '@/interfaces/IOrder';

export function useCreateOrder() {
  return useMutation<TBaseResponse<IOrder>, Error, ICreateOrderPayload>({
    mutationFn: createOrder,
  });
}
