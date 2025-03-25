import { ILogInResponse } from '@/interfaces/IAuth';
import { IUser } from '@/interfaces/IUser';
import { axiosInstance } from '@/lib/utils/axiosInstance';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CheckoutInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type AuthState = {
  user: IUser | null;
  checkoutInfo: CheckoutInfo,
  login: (user: IUser) => void;
  logout: () => void;
  updateCheckoutInfo: (info: Partial<CheckoutInfo>) => void
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
      checkoutInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
      },
      login: (user) => set({ user }, false),
      logout: () => set(() => ({ user: null })),
      updateCheckoutInfo: (info) =>
        set((state) => ({ checkoutInfo: { ...state.checkoutInfo, ...info } })),
    }),
    { name: 'auth-store' }
  ))
);