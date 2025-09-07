import { NextRequest } from "next/server";
import { parseMagicBricks, RawProject } from "@/lib/scrapeMagicBricks";

export const runtime = "nodejs";

async function tryFetch(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Bad status " + res.status);
    return await res.text();
  } catch (e) {
    return null;
  }
}

async function geocode(query: string) {
  const key = process.env.POSITIONSTACK_API_KEY;
  if (!key) return { lat: null, lon: null };
  try {
    const url = `http://api.positionstack.com/v1/forward?access_key=${key}&query=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return { lat: null, lon: null };
    const data = await res.json();
    const item = data?.data?.[0];
    if (item) return { lat: item.latitude, lon: item.longitude };
  } catch {}
  return { lat: null, lon: null };
}

// Fallback mock projects if scraping fails
function mockProjects(city: string): RawProject[] {
  const areas = ["Central", "North", "East", "South", "West"];
  return Array.from({ length: 10 }).map((_, i) => ({
    name: `${city} Heights Phase ${i + 1}`,
    location: `${areas[i % areas.length]} ${city}`,
    priceRange: `₹ ${(50 + i * 5)}L - ₹ ${(60 + i * 5)}L`,
    builder: ["ABC Builders", "Sunrise Dev", "Green Homes"][i % 3]
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") || "Hyderabad").trim();

  const stream = new ReadableStream({
    async start(controller) {
      function send(obj: any) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`));
      }

      send({ type: "status", message: `Scraping projects for ${city}…` });
      const url = `https://www.magicbricks.com/new-projects-${encodeURIComponent(city)}`;
      const html = await tryFetch(url);

      let projects: RawProject[] = [];
      if (html) {
        projects = parseMagicBricks(html);
      }
      if (!projects.length) {
        send({ type: "status", message: "Could not parse MagicBricks reliably. Using mock data for demo." });
        projects = mockProjects(city);
      }

      for (const p of projects) {
        const q = `${p.name}, ${p.location}, ${city}`;
        const { lat, lon } = await geocode(q);
        await new Promise((r) => setTimeout(r, 300)); // small delay to simulate incremental arrival
        send({ type: "project", data: { ...p, lat, lon } });
      }

      send({ type: "done" });
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
