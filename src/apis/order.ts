import { OrderStatus } from "@/constants/orderStatus";
import { ICreateOrderPayload, IOrder } from "@/interfaces/IOrder";
import { IPaymentMethod } from "@/interfaces/IPayment";
import { TBaseResponse } from "@/types/response.type";

type OrdersMeta = {
  countsByStatus: Record<OrderStatus, number>;
  totalsByStatus: Record<OrderStatus, number>;
  overall: { count: number; sum: number };
};


export async function createOrder(payload: ICreateOrderPayload) {
  const res = await fetch('/api/bff/order/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Create order failed');
  return data as TBaseResponse<IOrder>;
}

export async function getUserPurchases(params: { type?: number } = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== 0) qs.set(k, String(v));
  }
  const url = `/api/bff/order/user-purchase${qs.toString() ? `?${qs}` : ''}`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<TBaseResponse<IOrder[], OrdersMeta>>;
}

export async function getPaymentMethods() {
  const r = await fetch('/api/bff/payment-method', { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<TBaseResponse<IPaymentMethod[]>>;
}