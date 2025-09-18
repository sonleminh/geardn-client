export function buildUrl(base: string, path: string, params?: Record<string, string | number | boolean | undefined>) {
    const u = new URL(path.replace(/^\/+/, ''), base.endsWith('/') ? base : base + '/');
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === '') continue;
        u.searchParams.set(k, String(v));
      }
    }
    return u;
  }