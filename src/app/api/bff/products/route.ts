import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const sp = new URL(req.url).searchParams;
    const q = sp.get("q") ?? "";
    const page = sp.get("page") ?? "1";
    const limit = sp.get("limit") ?? "12";
    const sort = sp.get("sort") ?? "new";
    const qs = new URLSearchParams({ q, page, limit, sort });
    console.log('qs', qs.toString());
  return proxyBE(req, `/products?${qs.toString()}`);      
}
