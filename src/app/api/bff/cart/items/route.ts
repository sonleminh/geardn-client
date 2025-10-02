import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
  return proxyBE(req, `/carts/items`, {
    method: 'POST',
    headers:{ 'content-type':'application/json' },
    body: JSON.stringify(body),
  });
}