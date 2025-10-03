import { IUser } from "@/interfaces/IUser";
import { bff } from "@/lib/api-fetch";
import { TBaseResponse } from "@/types/response.type";

export const whoami = async () => {
  return bff<TBaseResponse<IUser>>('/api/bff/auth/whoami');
}