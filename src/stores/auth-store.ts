import { ILogInResponse } from '@/interfaces/IAuth';
import { IUser } from '@/interfaces/IUser';
import { axiosInstance } from '@/lib/utils/axiosInstance';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AuthState = {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
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
      isLoading: true,
      fetchUser: async () => {
        try {
          const res = await axiosInstance.get("/auth/whoami", { withCredentials: true });
          if (!res) throw new Error("Not authenticated");
          set({ user: res?.data, isLoading: false });
        } catch {
          set({ user: null, isLoading: false });
        }
      },
      login: (user) => set({ user }, false),
      logout: () => set(() => ({ user: null })),
    }),
    { name: 'auth-store' }
  ))
);