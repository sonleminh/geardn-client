import { proxyBE } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export const revalidate = 60; // ISR 60s (đổi tuỳ ý). Nếu luôn động: export const revalidate = 0
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;               
  console.log('first render product/slug:', slug);
  console.log('encodeURIComponent(params.slug):', encodeURIComponent(slug));
  return proxyBE(req, `/products/slug/${encodeURIComponent(slug)}`);
}
