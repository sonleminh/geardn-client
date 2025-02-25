// // src/providers/counter-store-provider.tsx
// 'use client';

// import { type ReactNode, createContext, useRef, useContext } from 'react';
// import { useStore } from 'zustand';
// import { ColorModeStore } from '@/stores/color-mode-store';

// export type ColorModeStoreApi = ReturnType<typeof colorModeStore>;

// export const ColorModeStoreContext = createContext<
//   ColorModeStoreApi | undefined
// >(undefined);

// export interface ColorModeStoreProviderProps {
//   children?: ReactNode;
// }

// export const ColorModeStoreProvider = ({
//   children,
// }: ColorModeStoreProviderProps) => {
//   const storeRef = useRef<ColorModeStoreApi>();
//   if (!storeRef.current) {
//     storeRef.current = colorModeStore();
//   }

//   return (
//     <ColorModeStoreContext.Provider value={storeRef.current}>
//       {children}
//     </ColorModeStoreContext.Provider>
//   );
// };

// export const useAuthStore = <T,>(selector: (store: ColorModeStore) => T): T => {
//   const colorModeStoreContext = useContext(ColorModeStoreContext);

//   if (!ColorModeStoreContext) {
//     throw new Error(`useCounterStore must be used within CounterStoreProvider`);
//   }

//   return useStore(colorModeStoreContext, selector);
// };
