# MagicBricks Real Estate Next.js Project

A Next.js application that fetches and displays real estate projects in real-time by scraping data from MagicBricks. This project includes dynamic routing, real-time incremental data loading, and an interactive map showing project locations using the PositionStack API.

---

## Features

- **Dynamic Routing:**  
  `/city/[cityName]` fetches projects for the specified city dynamically.

- **Real-Time Data Updates:**  
  Projects are displayed incrementally as they are retrieved, with a loading spinner.

- **Interactive Map:**  
  Project locations are geocoded using the PositionStack API and displayed on a map with markers. Clicking a marker shows project details (name, price, builder).

- **Responsive UI:**  
  Built with Next.js and Tailwind CSS for a modern and responsive interface.

---

## Screenshots

*(Replace with your own screenshots after running the project locally)*

![Home](./screenshots/home.png)  
![City View](./screenshots/city.png)  
![Map View](./screenshots/map.png)

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend/API Routes:** Next.js API routes for scraping and geocoding  
- **Map Integration:** Leaflet.js for interactive maps  
- **Geocoding API:** [PositionStack API](https://positionstack.com)  
- **State Management:** Zustand  

---

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)  
- npm (v9 or above)

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/sforswabhimaan/megicbricks_realestate_nextjs.git
cd megicbricks-realtime-next
