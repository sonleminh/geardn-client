import { ILogInResponse } from '@/interfaces/IAuth';
import { IUser } from '@/interfaces/IUser';
import { axiosInstance } from '@/lib/utils/axiosInstance';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AuthState = {
  user: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
}

export type AuthStore = AuthState

// export const useAuthStore = (
// ) => {
//   return createStore<AuthStore>()((devtools(persist((set) => ({
//     user: null,
//     login: (user) => set({ user }, false, "login"),
//     logout: () => set(() => ({ user: null })),
//   }), {
//     name: 'store',
//   }))))
// }

export const useAuthStore = create<AuthState>()(
 devtools( persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }, false),
      logout: () => set(() => ({ user: null })),
    }),
    { name: 'auth-store' }
  ))
);