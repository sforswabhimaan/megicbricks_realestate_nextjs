# MagicBricks Realtime Project Listings (Next.js 14)

This app demonstrates real-time scraping of MagicBricks project listings per city, streaming results incrementally to the UI (via **Server-Sent Events**) and plotting project locations on an interactive **Leaflet** map using the **PositionStack** API for geocoding.

## ✨ Features
- Dynamic routing at `/city/[cityName]` (e.g. `/city/Hyderabad`)
- **SSE incremental loading**: projects appear one-by-one as they are scraped/geocoded
- Interactive map with markers and popups (project name, location, price, builder)
- Defensive scraper with a **mock fallback** if MagicBricks markup changes or blocks requests
- Clean UI with Tailwind CSS
- API routes for scraping and geocoding

> ⚠️ **Note on scraping:** MagicBricks website structure can change and may block automated requests. This project includes a resilient parser and a **mock fallback** to still demonstrate real-time incremental UI and map features for the assignment.

## 🛠 Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cheerio (HTML parsing)
- Leaflet + react-leaflet
- Zustand (lightweight state)
- PositionStack geocoding API

## 🚀 Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables
Copy the example and add your PositionStack key:
```bash
cp .env.local.example .env.local
# edit .env.local and set POSITIONSTACK_API_KEY=YOUR_KEY
```

Get a free API key at https://positionstack.com

### 3) Run the dev server
```bash
npm run dev
```
Open http://localhost:3000 and try `/city/Hyderabad`

## 📦 Project Structure
```
app/
  api/
    geocode/route.ts     # Geocoding via PositionStack
    scrape/route.ts      # SSE endpoint: scrapes MagicBricks + geocodes incrementally
  city/[cityName]/
    page.tsx             # Server component for city route
    ui.tsx               # Client component connecting to SSE, renders list + map
  globals.css            # Tailwind + base styles
  layout.tsx             # Root layout
components/
  MapClient.tsx          # Leaflet map (client-only)
lib/
  scrapeMagicBricks.ts   # Cheerio parser (with defensive heuristics)
tailwind.config.ts
postcss.config.mjs
next.config.mjs
package.json
tsconfig.json
```

## 🗺 Map Notes
- We use **OpenStreetMap** tiles via Leaflet.
- Map automatically fits to project marker bounds when available.

## 🧪 How Real-Time Works
The `/api/scrape` endpoint streams **Server-Sent Events**. The UI listens with `EventSource` and appends projects as they arrive. Each project is geocoded (server-side) using PositionStack before emitting.

If scraping fails or returns zero results, the API falls back to a **mock generator** so the UI/UX and map still fulfill the assignment requirements.

## 🧑‍💻 Assumptions & Decisions
- App Router chosen for modern Next.js patterns.
- SSE used for incremental loading (cleaner than polling).
- Geocoding is done server-side (if `POSITIONSTACK_API_KEY` is present). If not, coordinates are omitted but UI still renders.
- The scraper is intentionally tolerant and may break if MagicBricks changes markup — mock fallback ensures demo remains functional.

## 🧾 Deployment
- Click **Deploy** to Vercel from your GitHub repo (Next.js default settings).
- Configure the **Environment Variable** `POSITIONSTACK_API_KEY` in Vercel Project Settings.

## 🎥 Screen Recording (what to show)
1. Navigate to `/city/Hyderabad`
2. Point at loading status (“Scraping…”, projects appearing one-by-one)
3. Show markers appearing on the map; click marker for popup
4. Mention the mock fallback when scraping is blocked

---

**Author:** Generated for the MagicBricks assignment. Enjoy!
"# megicbricks_realestate_nextjs" 
