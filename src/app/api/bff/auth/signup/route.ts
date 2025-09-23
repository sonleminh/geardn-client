// src/app/api/bff/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const beRes = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
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
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? 'Internal error' },
      { status: 500 },
    );
  }
}
