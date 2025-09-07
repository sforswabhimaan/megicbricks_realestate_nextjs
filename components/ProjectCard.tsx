"use client";

interface ProjectCardProps {
  name: string;
  location: string;
  priceRange: string;
  builder: string;
}

export default function ProjectCard({
  name,
  location,
  priceRange,
  builder,
}: ProjectCardProps) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border">
      <h2 className="text-lg font-bold text-blue-600 mb-2">{name}</h2>
      <p className="text-sm text-gray-600">
        📍 {location}
      </p>
      <p className="text-sm font-medium text-green-600 mt-2">
        💰 {priceRange}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        🏗️ Builder: {builder}
      </p>
    </div>
  );
}
