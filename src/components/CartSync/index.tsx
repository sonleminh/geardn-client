'use client';

import { useSyncCart } from '@/apis/cart';
import { useCartStore } from '@/stores/cart-store';
import { useEffect } from 'react';

const CartSync = ({ children }: { children?: React.ReactNode }) => {
  const { syncCart, cartItems } = useCartStore();
  const { mutateAsync: syncCartReloadServer } = useSyncCart();

  useEffect(() => {
    const handleBeforeUnload = () => {
      syncCart(cartItems);
      syncCartReloadServer(cartItems);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cartItems, syncCart]);

  return <>{children}</>;
};

export default CartSync;
