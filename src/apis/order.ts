import { ICreateOrderPayload, IOrder } from "@/interfaces/IOrder";
import { TBaseResponse } from "@/types/response.type";

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