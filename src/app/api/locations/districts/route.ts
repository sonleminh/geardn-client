// src/app/api/locations/districts/route.ts
export const revalidate = 86400;
const ORG = 'https://provinces.open-api.vn/api';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const provinceCode = u.searchParams.get('provinceCode');
  if (!provinceCode) return Response.json([], { status: 200 });

  // Lấy danh sách quận/huyện theo tỉnh: /p/{code}?depth=2 và đọc p.districts
  const r = await fetch(`${ORG}/p/${provinceCode}?depth=2`, { cache: 'force-cache', next: { revalidate } });
  if (!r.ok) return Response.json({ message: 'Upstream error' }, { status: r.status });
  type UpstreamDistrict = { code: number; name: string };
  type UpstreamProvince = { districts?: UpstreamDistrict[] };
  const p = (await r.json()) as UpstreamProvince;
  const data = (p?.districts ?? []).map((d: UpstreamDistrict) => ({ id: d.code, code: d.code, name: d.name }));
  return Response.json(data);
}
