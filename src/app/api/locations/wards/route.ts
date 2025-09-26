// src/app/api/locations/wards/route.ts
export const revalidate = 86400;
const ORG = 'https://provinces.open-api.vn/api';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const districtCode = u.searchParams.get('districtCode');
  if (!districtCode) return Response.json([], { status: 200 });

  // API thường: /d/{code}?depth=2 -> wards trong .wards
  const r = await fetch(`${ORG}/d/${districtCode}?depth=2`, { cache: 'force-cache', next: { revalidate } });
  if (!r.ok) return Response.json({ message: 'Upstream error' }, { status: r.status });
  const d = await r.json() as any;
  const data = (d.wards ?? []).map((w: any) => ({ id: w.code, code: w.code, name: w.name }));
  return Response.json(data);
}
