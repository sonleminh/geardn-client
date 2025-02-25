import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorModeState = {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

export type ColorModeStore = ColorModeState

export const useColorModeStore = create<ColorModeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleColorMode: () =>
        set((state) => {
          return { mode: state.mode === 'light' ? 'dark' : 'light' };
        }),
    }),
    { name: 'color-mode-storage' } // 🛒 Persists cart for guest users
  )
);