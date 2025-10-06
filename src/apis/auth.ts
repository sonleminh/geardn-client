import { bff } from "@/lib/api-fetch";
import { ILogInResponse, ISignUpResponse, IWhoAmIResponse } from "@/interfaces/IAuth";
import { TBaseResponse } from "@/types/response.type";

export const signup = (payload: { name: string; email: string; password: string }) => bff<TBaseResponse<ISignUpResponse>>('/api/bff/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  
export const loginWithEmailPwd =  (payload: { email: string; password: string }) => bff<TBaseResponse<ILogInResponse>>('/api/bff/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  export const googleLogin =  (payload: { idToken: string }) => bff<TBaseResponse<ILogInResponse>>('/api/bff/auth/google/verify-id-token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });


export const logoutAPI = () => 
  bff('/api/bff/auth/logout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });

export const whoami = () =>  fetch('/api/bff/auth/whoami', { cache: 'no-store' });
