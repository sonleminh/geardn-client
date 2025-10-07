import { googleLogin, loginWithEmailPwd, logout, signup } from '@/apis/auth';
import { ILogInResponse, ILogoutResponse, ISignUpResponse } from '@/interfaces/IAuth';
import { TBaseResponse } from '@/types/response.type';
import { useMutation } from '@tanstack/react-query';

export function useLoginWithEmailPwd() {
  return useMutation<TBaseResponse<ILogInResponse>, Error, {email: string; password: string}>({
    mutationFn: loginWithEmailPwd,
  });
}

export function useGoogleLogin() {
  return useMutation<TBaseResponse<ILogInResponse>, Error, {idToken: string}>({
    mutationFn: googleLogin,
  });
}

export function useSignup() {
  return useMutation<TBaseResponse<ISignUpResponse>, Error,{ name: string; email: string; password: string }>({
    mutationFn: signup,
  });
}

export function useLogout() {
  return useMutation<TBaseResponse<ILogoutResponse>, Error>({
    mutationFn: logout,
  });
}