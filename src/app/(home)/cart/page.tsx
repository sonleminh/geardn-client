// app/(shop)/cart/page.tsx  (RSC)
import CartClient from './CartClient';
import { getCartOnServer } from '@/data/cart.server';

export default async function Page() {
  const cart = await getCartOnServer(); // SSR, không chớp
  // console.log('first render cart:', cart);
  return <CartClient initialCart={cart} />;
}
