// stores/useCartStore.ts
import { ICartStoreItem } from '@/interfaces/ICart';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartState = {
  cartItems: ICartStoreItem[];
  addToCart: (item: ICartStoreItem) => void;
  removeFromCart: (skuId: number) => void;
  clearCart: () => void;
  updateQuantity: (skuId: number, quantity: number) => void;
}

export type CartStore = CartState

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.skuId === item.skuId);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.skuId === item.skuId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, item] };
        }),
      removeFromCart: (skuId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.skuId !== skuId),
        })),
      clearCart: () => set({ cartItems: [] }),
      updateQuantity: (skuId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.skuId === skuId ? { ...i, quantity } : i
          ),
        })),
    }),
    { name: 'cart-storage' } // 🛒 Persists cart for guest users
  )
);
