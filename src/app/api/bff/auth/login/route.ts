// src/app/api/bff/auth/signup/route.ts
import { NextRequest } from 'next/server';
import { proxyBE } from '@/lib/proxy';

export async function POST(req: NextRequest) {
<<<<<<< HEAD
  const body = await req.json();
  return proxyBE(req, '/auth/login', body);
=======
  try {
    const body = await req.json();

    const beRes = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        // chuyển cookie client -> BE nếu BE cần (không luôn bắt buộc)
        cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // đọc JSON an toàn
    let data: unknown = null;
    try {
      data = await beRes.json();
    } catch {
      // có thể là rỗng
    }

    // tạo response cho FE, giữ nguyên status của BE
    const out = NextResponse.json(data ?? {}, { status: beRes.status });

    // chuyển tiếp Set-Cookie từ BE về client (token, cartId, vv.)
    const setCookie = beRes.headers.get('set-cookie');
    if (setCookie) out.headers.set('set-cookie', setCookie);

    return out;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
>>>>>>> origin/feat/home-work
}
