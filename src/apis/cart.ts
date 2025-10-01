import { ICartResponse, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from "@/interfaces/ICart";
import { TBaseResponse } from "@/types/response.type";
import { bff } from "@/lib/api-fetch";

export const getCart = () => bff<TBaseResponse<any>>('/api/bff/cart');

export const syncCart = (payload: ISyncCartPayload) =>
  bff<TBaseResponse<ICartResponse>>(`/api/bff/cart/sync`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });

export const updateQty = (payload: IUpdateQuantityPayload) =>
  bff<TBaseResponse<IUpdateQuantityResponse>>(`/api/bff/cart/items/${payload.id}`, { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });

export const deleteCartItem = (id: number) =>
  bff<TBaseResponse<IUpdateQuantityResponse>>(`/api/bff/cart/items/${id}`, { method:'DELETE', headers:{'content-type':'application/json'} });