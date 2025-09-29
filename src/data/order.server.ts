import { IOrder } from '@/interfaces/IOrder';
import { fetchJson, buildUrl } from '@/lib/http';
import { TBaseResponse } from '@/types/response.type';


export async function fetchOrder(params: { code: string, revalidate?: number }) {
  const { code = '', revalidate = 60 } = params;
  const url = buildUrl(process.env.NEXT_PUBLIC_API!, `/orders/${code}`);
  return fetchJson<TBaseResponse<IOrder>>(url, { revalidate });
}