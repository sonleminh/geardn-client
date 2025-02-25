// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { postRequest } from '@/utils/fetch-client';
import { BASE_API_URL } from '@/constants/env';
import { ILogInResponse, ILogoutResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';

export async function loginAPI(payload: {email: string, password: string}) {
  try {
    const res: ILogInResponse = await postRequest(`/auth/login`, payload);
    return res;
  } catch (error) {
    throw error
  }
}

export async function signUpAPI(payload: {name: string ,email: string, password: string}) {
  try {
    const res: ISignUpResponse = await postRequest(`/auth/signup`, payload);
    return res;
  } catch (error) {
    throw error
  }
}

export async function logoutAPI() {
  try {
    const res: ILogoutResponse = await postRequest(`/auth/logout`, {});
    return res;
  } catch (error) {
    throw error
  }
}