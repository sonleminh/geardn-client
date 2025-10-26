import { IOrder } from '@/interfaces/IOrder';
import { fetchJson, buildUrl } from '@/lib/http';
import { BaseResponse } from '@/types/response.type';


export async function fetchOrder(params: { code: string, revalidate?: number }) {
  const { code = '', revalidate = 60 } = params;
  const url = buildUrl(process.env.NEXT_PUBLIC_API!, `/orders/${code}`);
  return fetchJson<BaseResponse<IOrder>>(url, { revalidate });
}