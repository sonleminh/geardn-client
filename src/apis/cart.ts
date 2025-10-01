import { IUpdateQuantityPayload, IUpdateQuantityResponse } from "@/interfaces/ICart";
import { TBaseResponse } from "@/types/response.type";
import { bff } from "@/lib/api-fetch";

export const getCart = () => bff<TBaseResponse<any>>('/api/bff/cart');

export const updateQty = (payload: IUpdateQuantityPayload) =>
  bff<TBaseResponse<IUpdateQuantityResponse>>(`/api/bff/cart/update-quantity`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });