const API = process.env.NEXT_PUBLIC_API!;

export function buildUrl(base: string, path: string, params?: Record<string, string | number | boolean | undefined>) {
  const u = new URL(path.replace(/^\/+/, ''), base.endsWith('/') ? base : base + '/');
  if (params) for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') u.searchParams.set(k, String(v));
  return u.toString();
}

export async function fetchJson<T>(input: string, init?: RequestInit & { revalidate?: number }) {
  const { revalidate = 60, ...rest } = init ?? {};
  const res = await fetch(input, {
    ...rest,
    headers: { accept: 'application/json', ...(rest.headers || {}) },
    // Cache App Router: SSR + revalidate
    next: { revalidate },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
