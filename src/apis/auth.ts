import { ILogInResponse, ISignUpResponse, IWhoAmIResponse } from "@/interfaces/IAuth";
import { TBaseResponse } from "@/types/response.type";

export async function signup(payload: { name: string; email: string; password: string }) {
  const res = await fetch('/api/bff/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Signup failed');
  return data as TBaseResponse<ISignUpResponse>;
}
  
export async function loginWithEmailPwd(payload: { email: string; password: string }) {
  const res = await fetch('/api/bff/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  return data as TBaseResponse<ILogInResponse>;
}

export async function whoami() {
  const r = await fetch('/api/bff/auth/whoami', { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<TBaseResponse<IWhoAmIResponse>>;
}
