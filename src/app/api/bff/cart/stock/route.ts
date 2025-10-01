import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const qs = u.searchParams.toString();        
  return proxyBE(req, `/carts/stocks?${qs}`);      
}
