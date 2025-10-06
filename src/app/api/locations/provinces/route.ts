import { ILocationOption } from "@/interfaces/ILocation";

export const revalidate = 86400; // cache 24h
const ORG = 'https://provinces.open-api.vn/api';

export async function GET() {
  const r = await fetch(`${ORG}/p/`, { cache: 'force-cache', next: { revalidate } });
  if (!r.ok) return Response.json({ message: 'Upstream error' }, { status: r.status });
  const list = await r.json() as Array<ILocationOption>;
  const data = list.map(p => ({ id: p.code, code: p.code, name: p.name }));
  return Response.json(data);
}
