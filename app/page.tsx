"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("Hyderabad");
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">MagicBricks Realtime Project Listings</h1>
      <p className="text-gray-600">Enter a city to scrape projects and visualize them on a live map.</p>
      <div className="card space-y-3">
        <label className="block text-sm font-medium">City name</label>
        <input
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g., Hyderabad, Pune, Mumbai"
        />
        <button className="btn" onClick={() => router.push(`/city/${encodeURIComponent(city)}`)}>
          View Projects in {city}
        </button>
      </div>
      <div className="text-sm text-gray-500">
        Tip: Try cities like <span className="badge">Hyderabad</span>, <span className="badge">Pune</span>,
        <span className="badge">Mumbai</span>.
      </div>
    </div>
  );
}
