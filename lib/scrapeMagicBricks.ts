import * as cheerio from "cheerio";

export type RawProject = {
  name: string;
  location: string;
  priceRange?: string | null;
  builder?: string | null;
};

// Very defensive parser: structure on MagicBricks can change; we try several selectors.
// If parsing returns zero items, the caller should use a mock fallback.
export function parseMagicBricks(html: string): RawProject[] {
  const $ = cheerio.load(html);
  const results: RawProject[] = [];

  // Heuristic selectors (subject to change!)
  $(".mb-srp__card, .srp-card, .project-card, [data-project-card], .mb-card").each((_, el) => {
    const name =
      $(el).find(".mb-srp__card--title, .project-title, h2, [data-name]").first().text().trim() ||
      $(el).attr("data-name")?.trim() ||
      "";
    const location =
      $(el).find(".mb-srp__card--address, .project-location, .loc, [data-location]").first().text().trim() ||
      $(el).attr("data-location")?.trim() ||
      "";
    const priceRange =
      $(el).find(".mb-srp__card__price--amount, .price, .range, [data-price]").first().text().trim() ||
      $(el).attr("data-price")?.trim() ||
      null;
    const builder =
      $(el).find(".builder-name, .mb-srp__card--subtitle, .by-builder, [data-builder]").first().text().trim() ||
      $(el).attr("data-builder")?.trim() ||
      null;

    if (name || location) {
      results.push({ name: name || "Unknown Project", location: location || "Unknown", priceRange, builder });
    }
  });

  // If that failed, try to read JSON embedded in script tags (common on modern sites)
  if (results.length === 0) {
    $("script").each((_, el) => {
      const txt = $(el).contents().text();
      try {
        // naive search of "projects" array
        const match = txt.match(/"projects"\s*:\s*(\[[\s\S]*?\])/i);
        if (match) {
          const arr = JSON.parse(match[1]);
          if (Array.isArray(arr)) {
            for (const it of arr) {
              if (typeof it === "object" && it) {
                results.push({
                  name: it.name || it.project_name || "Unknown Project",
                  location: it.location || it.locality || it.address || "Unknown",
                  priceRange: it.priceRange || it.price || null,
                  builder: it.builder || it.builder_name || null,
                });
              }
            }
          }
        }
      } catch {}
    });
  }

  return results;
}
