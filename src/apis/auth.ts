import { ILogInResponse, ISignUpResponse } from "@/interfaces/IAuth";
import { bff } from "@/lib/api-fetch";
<<<<<<< HEAD
import { ILogInResponse, ISignUpResponse, IWhoAmIResponse } from "@/interfaces/IAuth";
=======
>>>>>>> origin/feat/home-work
import { TBaseResponse } from "@/types/response.type";
import { CredentialResponse} from "@react-oauth/google";

export const signup = (payload: { name: string; email: string; password: string }) => bff<TBaseResponse<ISignUpResponse>>('/api/bff/auth/signup', {
<<<<<<< HEAD
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
=======
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

export const loginWithEmailPwd =  (payload: { email: string; password: string }) => bff<TBaseResponse<ILogInResponse>>('/api/bff/auth/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});
>>>>>>> origin/feat/home-work

export const googleLogin =  (payload: {idToken: string }) => bff('/api/bff/auth/google/verify-id-token', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

export const logoutAPI = () => 
bff('/api/bff/auth/logout', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
});

export const whoami = () =>  bff('/api/bff/auth/whoami', { cache: 'no-store' });