"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Project {
  id: string;
  name: string;
  location: string;
  price: string;
  builder: string;
  latitude: number;
  longitude: number;
}

export default function MapClient({ projects }: { projects: Project[] }) {

  const DefaultIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <MapContainer
      center={[20.5937, 78.9629]} 
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {projects.map((p) =>
        p.latitude && p.longitude ? (
          <Marker key={p.id} position={[p.latitude, p.longitude]}>
            <Popup>
              <strong>{p.name}</strong> <br />
              {p.location} <br />
              {p.price} <br />
              Builder: {p.builder}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
