import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicBricks Realtime Projects",
  description: "Scrape projects in real-time and visualize on a map"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-4 md:p-6">{children}</div>
      </body>
    </html>
  );
}
