import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();

  return proxyBE(req, `/carts/items/${params.id}`, {
    method: 'PATCH',
    headers:{ 'content-type':'application/json' },
    body: JSON.stringify(body),
  });
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return proxyBE(req, `/carts/items/${params.id}`, {
    method: 'DELETE',
    headers:{ 'content-type':'application/json' }
  });
}