import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export const revalidate = 0;
const ALLOWED = new Set(['cursor','limit','sortBy','order']);
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const qs = new URLSearchParams();
 
  for (const [k,v] of u.searchParams) if (ALLOWED.has(k) && v !== '') qs.set(k,v);
  const path = `/products/search${qs.size?`?${qs}`:''}`;
  return proxyBE(req, path);
}
