import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';  

export async function POST(req: NextRequest) {
    const body = await req.json();
  return proxyBE(req, `/carts/items`, {
    method: 'POST',
    headers:{ 'content-type':'application/json' },
    body: JSON.stringify(body),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;               
    const body = await req.json();
  return proxyBE(req, `/carts/items/${id}`, {
    method: 'PATCH',
    headers:{ 'content-type':'application/json' },
    body: JSON.stringify(body),
  });
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;               
    return proxyBE(req, `/carts/items/${id}`, {
    method: 'DELETE',
    headers:{ 'content-type':'application/json' },
  });
}