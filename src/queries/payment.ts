// src/queries/payment.ts
import { useQuery } from '@tanstack/react-query';
import { getPaymentMethods } from '@/apis/payment';
import { IPaymentMethod } from '@/interfaces/IPayment';
import { TPaginatedResponse } from '@/types/response.type';

export const usePaymentMethods = () =>
  useQuery<TPaginatedResponse<IPaymentMethod>>({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
    staleTime: 5 * 60 * 1000,
  });
