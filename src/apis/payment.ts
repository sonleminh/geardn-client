import { IPaymentMethod } from "@/interfaces/IPayment";
import { TPaginatedResponse } from "@/types/response.type";

export async function getPaymentMethods() {
  const r = await fetch('/api/bff/payment-method', { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<TPaginatedResponse<IPaymentMethod>>;
}
