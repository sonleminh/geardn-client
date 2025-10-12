import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return proxyBE(req, `/categories`);      
}