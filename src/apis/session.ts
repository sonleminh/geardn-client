import { IWhoAmIResponse } from "@/interfaces/IAuth";
import { bff } from "@/lib/fetcher";

export const whoami = () => bff<IWhoAmIResponse>('/api/bff/auth/whoami');