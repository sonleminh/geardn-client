import { ILocationOption } from "@/interfaces/ILocation";
import { BaseResponse } from "@/types/response.type";

export const getProvinces = async () =>
    (await fetch('/api/bff/province', { cache: 'no-store' })).json() as Promise<BaseResponse<ILocationOption[]>>;
  
  export const getDistricts = async (provinceCode: string | number) =>
    (await fetch(`/api/bff/province/districts?provinceCode=${provinceCode}`, { cache: 'force-cache' })).json() as Promise<Array<{id:number; code:number; name:string}>>;
  
  export const getWards = async (districtCode: string | number) =>
    (await fetch(`/api/bff/province/wards?districtCode=${districtCode}`, { cache: 'force-cache' })).json() as Promise<Array<{id:number; code:number; name:string}>>;
  