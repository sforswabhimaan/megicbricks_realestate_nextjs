import { NextRequest } from "next/server";

export const runtime = "nodejs";

async function geocode(query: string) {
  const key = process.env.POSITIONSTACK_API_KEY;
  const url = `http://api.positionstack.com/v1/forward?access_key=${key}&query=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding error");
  const data = await res.json();
  const item = data?.data?.[0];
  if (item) return { lat: item.latitude, lon: item.longitude };
  return { lat: null, lon: null };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body as { query: string };
    if (!process.env.POSITIONSTACK_API_KEY) {
      return new Response(JSON.stringify({ lat: null, lon: null, error: "No API key" }), { status: 200 });
    }
    const coords = await geocode(query);
    return new Response(JSON.stringify(coords), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ lat: null, lon: null, error: e?.message || "error" }), { status: 500 });
  }
}
