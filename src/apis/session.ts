import { IWhoAmIResponse } from "@/interfaces/IAuth";
import { bff } from "@/lib/fetcher";
import { TBaseResponse } from "@/types/response.type";

export const whoami = async () => {
  const res = await bff<TBaseResponse<IWhoAmIResponse>>('/api/bff/auth/whoami');
  return res.data
}