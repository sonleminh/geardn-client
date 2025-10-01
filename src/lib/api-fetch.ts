let refreshing: Promise<Response>|null = null;
const refreshOnce = () =>
  (refreshing ??= fetch('/api/bff/auth/refresh', { method:'POST', cache:'no-store' })
    .finally(()=> (refreshing=null)));

async function parse(res: Response) {
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function bff<T>(input: string, init?: RequestInit): Promise<T> {
  const doFetch = () => fetch(input, { ...init, cache:'no-store' });
  let r = await doFetch();
  if (r.status !== 401) {
    if (!r.ok) throw new Error(String(await parse(r)));
    return parse(r) as Promise<T>;
  }
  const rf = await refreshOnce();
  if (!rf.ok) throw new Error('Unauthorized');
  r = await doFetch();
  if (!r.ok) throw new Error(String(await parse(r)));
  return parse(r) as Promise<T>;
}
