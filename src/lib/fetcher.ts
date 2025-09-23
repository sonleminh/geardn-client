// src/lib/fetcher.ts
async function parseMaybeJson(res: Response) {
    if (res.status === 204) return null;
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }
  
  export async function bff<T>(input: string, init?: RequestInit): Promise<T> {
    const doFetch = () => fetch(input, { ...init, cache: 'no-store' });
    let res = await doFetch();
    if (res.status !== 401) {
      if (!res.ok) throw new Error(String(await parseMaybeJson(res)));
      return parseMaybeJson(res) as Promise<T>;
    }
    // try refresh once
    const rf = await fetch('/api/bff/auth/refresh', { method: 'POST', cache: 'no-store' });
    if (!rf.ok) throw new Error('Unauthorized');
    // re-run original request (make sure init.body is re-creatable if it was a stream)
    res = await doFetch();
    if (!res.ok) throw new Error(String(await parseMaybeJson(res)));
    return parseMaybeJson(res) as Promise<T>;
  }
  