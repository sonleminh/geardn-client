// app/api/bff/cart/route.ts (GET cart)
import { NextRequest } from 'next/server';
import { proxyBE } from '@/lib/proxy';
export async function GET(req: NextRequest) {
    return proxyBE(req, '/carts');
}
