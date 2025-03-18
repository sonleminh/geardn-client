// stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: number;
  skuId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  attributes: {
    type: string;
    value: string;
  }[]
}

export type CartState = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
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
