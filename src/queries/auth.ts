import { googleLogin, loginWithEmailPwd, signup } from '@/apis/auth';
import { ILogInResponse, ISignUpResponse } from '@/interfaces/IAuth';
import { TBaseResponse } from '@/types/response.type';
import { useMutation } from '@tanstack/react-query';

export function useLoginWithEmailPwd() {
  return useMutation<TBaseResponse<ILogInResponse>, Error, {email: string; password: string}>({
    mutationFn: loginWithEmailPwd,
  });
}

export function useGoogleLogin() {
<<<<<<< HEAD
  return useMutation<TBaseResponse<ILogInResponse>, Error, {idToken: string}>({
=======
  return useMutation({
>>>>>>> origin/feat/home-work
    mutationFn: googleLogin,
  });
}

export function useSignup() {
  return useMutation<TBaseResponse<ISignUpResponse>, Error,{ name: string; email: string; password: string }>({
    mutationFn: signup,
  });
}