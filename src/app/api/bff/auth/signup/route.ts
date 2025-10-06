// src/app/api/bff/auth/signup/route.ts
import { NextRequest } from 'next/server';
import { proxyBE } from '@/lib/proxy';

export async function POST(req: NextRequest) {
    return proxyBE(req, '/auth/signup');
}
