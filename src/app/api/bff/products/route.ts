import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

const ALLOWED = new Set(['limit','page','sort','q']);
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const qs = new URLSearchParams();
 
  for (const [k,v] of u.searchParams) if (ALLOWED.has(k) && v !== '') qs.set(k,v);
  return proxyBE(req, `/products${qs.size?`?${qs.toString()}`:''}`);      
}
