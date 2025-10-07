// src/app/api/bff/auth/signup/route.ts
import { NextRequest } from 'next/server';
import { proxyBE } from '@/lib/proxy';

export async function POST(req: NextRequest) {
  const body = await req.json(); 
  return proxyBE(req, '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body) } );
}
