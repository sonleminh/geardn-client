// src/lib/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { splitCookiesString } from 'set-cookie-parser';

const BE = process.env.BACKEND_API_URL!;

export async function proxyBE<T = unknown>(
  req: NextRequest,
  path: string,
  init?: RequestInit
): Promise<NextResponse> {
  const method = init?.method ?? req.method;

  let body: RequestInit['body'] | undefined = init?.body;
  const shouldUseReqBody = body === undefined && method !== 'GET' && method !== 'HEAD';
  if (shouldUseReqBody && req.body) body = req.body;

  const headers: HeadersInit = {
    accept: 'application/json',
    ...(init?.headers ?? {}),
    cookie: req.headers.get('cookie') ?? '',
  };

  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store',
    redirect: 'manual',
  };

  if (body !== undefined) {
    options.body = body;
    // Thêm duplex nếu body là ReadableStream
    const isStream =
      typeof body === 'object' &&
      body !== null &&
      'getReader' in (body as object);
    if (isStream) {
      // @ts-expect-error: duplex là trường hợp đặc thù của undici
      options.duplex = 'half';
    }
  }

  const r = await fetch(`${BE}${path}`, options);

  if (r.status === 204) return new NextResponse(null, { status: 204 });

  const setCookieHeader = r.headers.get('set-cookie');
  const setCookies = setCookieHeader ? splitCookiesString(setCookieHeader) : [];

  const contentType = r.headers.get('content-type') ?? '';
  // Non-JSON: stream qua luôn
  if (!contentType.includes('application/json')) {
    const out = new NextResponse(r.body, {
      status: r.status,
      headers: { 'content-type': contentType },
    });
    for (const c of setCookies) out.headers.append('set-cookie', c);
    return out;
  }

  // JSON: parse an toàn, không any
  let data: T | object = {};
  try {
    data = (await r.json()) as T;
  } catch {
    // body rỗng hoặc JSON lỗi -> để {}
  }

  const out = NextResponse.json<T | object>(data, { status: r.status });
  for (const c of setCookies) out.headers.append('set-cookie', c);
  return out;
}
