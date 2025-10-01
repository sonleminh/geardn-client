// src/lib/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
const BE = process.env.BACKEND_API_URL!;

export async function proxyBE(req: NextRequest, path: string, init?: RequestInit) {
  const r = await fetch(`${BE}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init?.headers || {}),
      cookie: req.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
  });
  if (r.status === 204) return new NextResponse(null, { status: 204 });
  let data: any = null; try { data = await r.json(); } catch {}
  const out = NextResponse.json(data ?? {}, { status: r.status });
  const setCookie = r.headers.get('set-cookie'); // nếu BE có
  if (setCookie) out.headers.set('set-cookie', setCookie);
  return out;
}
