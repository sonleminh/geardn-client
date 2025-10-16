import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

const ALLOWED = new Set(['limit','page','sortBy','order','q']);
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const qs = new URLSearchParams();
  console.log('qs-u', u);
  console.log('qs-bff1', qs);
 
  for (const [k,v] of u.searchParams) if (ALLOWED.has(k) && v !== '') qs.set(k,v);
  console.log('qs-bff2', qs.toString());
  return proxyBE(req, `/products${qs.size?`?${qs.toString()}`:''}`);      
}
