"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { create } from "zustand";

type Project = {
  name: string;
  location: string;
  priceRange?: string | null;
  builder?: string | null;
  lat?: number | null;
  lon?: number | null;
};

type Store = {
  projects: Project[];
  push: (p: Project) => void;
  clear: () => void;
};
const useStore = create<Store>((set) => ({
  projects: [],
  push: (p) => set((s) => ({ projects: [...s.projects, p] })),
  clear: () => set({ projects: [] }),
}));

const MapClient = dynamic(() => import("@/components/MapClient"), { ssr: false });

export default function CityClient({ cityName }: { cityName: string }) {
  const { projects, push, clear } = useStore();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    clear();
    setLoading(true);
    setStatus("Connecting…");
    const url = `/api/scrape?city=${encodeURIComponent(cityName)}`;
    const es = new EventSource(url);
    sourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setStatus("Connected. Scraping live…");
    };

    es.onmessage = async (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === "project") {
          push(payload.data);
        } else if (payload.type === "done") {
          setStatus("Done.");
          setLoading(false);
          es.close();
        } else if (payload.type === "status") {
          setStatus(payload.message);
        }
      } catch (e) {
        // ignore
      }
    };

    es.onerror = () => {
      setStatus("Connection error. Falling back.");
      setLoading(false);
      es.close();
    };

    return () => {
      es.close();
      sourceRef.current = null;
    };
  }, [cityName, clear, push]);

  const bounds = useMemo(() => {
    const pts = projects.filter((p) => p.lat && p.lon).map((p) => [p.lat!, p.lon!] as [number, number]);
    if (!pts.length) return null;
    let minLat = pts[0][0], maxLat = pts[0][0], minLon = pts[0][1], maxLon = pts[0][1];
    for (const [la, lo] of pts) {
      minLat = Math.min(minLat, la);
      maxLat = Math.max(maxLat, la);
      minLon = Math.min(minLon, lo);
      maxLon = Math.max(maxLon, lo);
    }
    return [[minLat, minLon], [maxLat, maxLon]] as const;
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects in {cityName}</h1>
        <div className="text-sm text-gray-600">{status}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 card h-[70vh]">
          <MapClient projects={projects} bounds={bounds} />
        </div>
        <div className="md:col-span-2 card h-[70vh] overflow-auto space-y-3">
          {projects.length === 0 && (
            <div className="space-y-2">
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-4 w-3/5" />
              <div className="skeleton h-6 w-1/2" />
            </div>
          )}
          {projects.map((p, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-3">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.location}</div>
              {p.priceRange && <div className="text-sm mt-1">Price: {p.priceRange}</div>}
              {p.builder && <div className="text-sm">Builder: {p.builder}</div>}
              {(p.lat && p.lon) ? (
                <div className="text-xs text-gray-500 mt-1">({p.lat.toFixed(5)}, {p.lon.toFixed(5)})</div>
              ) : (
                <div className="text-xs text-gray-400 mt-1">Geocoding…</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
