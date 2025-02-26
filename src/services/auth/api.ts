import { postRequest } from '@/utils/fetch-client';
import { ILogInResponse, ILogoutResponse, ISignUpResponse } from '@/interfaces/IAuth';

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