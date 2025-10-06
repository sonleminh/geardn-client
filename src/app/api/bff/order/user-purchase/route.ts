import { NextRequest } from 'next/server';
import { proxyBE } from '@/lib/proxy';

export const revalidate = 0; // luôn động

const ALLOWED = new Set(['type']); 

export async function GET(req: NextRequest) {
  const u = new URL(req.url);

  // lọc query an toàn
  const qs = new URLSearchParams();
  for (const [k, v] of u.searchParams) if (ALLOWED.has(k) && v !== '') qs.set(k, v);

  const path = `/user-purchases${qs.toString() ? `?${qs.toString()}` : ''}`;
  return proxyBE(req, path);
}
