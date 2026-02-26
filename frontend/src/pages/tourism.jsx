// src/pages/tourism.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { key: "beach", label: "Beaches", image: "/beach.jpg" },
  { key: "mountain", label: "Mountains & Hiking", image: "/sunset.jpeg" },
  { key: "heritage", label: "Heritage & Culture", image: "/galle.jpg" },
  { key: "wildlife", label: "Wildlife", image: "/lagoon.jpeg" },
  { key: "waterfall", label: "Waterfalls", image: "/sunset.jpeg" },
  { key: "city", label: "City & Shopping", image: "/kandy.jpg" },
];

// Demo attractions (later you can move to src/data/attractions.js)
const attractions = [
  { id: "galle-fort", name: "Galle Fort", category: "heritage", rating: 4.7, time: "2–3 hours", image: "/galle.jpg" },
  { id: "mirissa-beach", name: "Mirissa Beach", category: "beach", rating: 4.6, time: "Half day", image: "/beach.jpg" },
  { id: "kandy-temple", name: "Temple of the Tooth", category: "heritage", rating: 4.8, time: "1–2 hours", image: "/kandy.jpg" },
  { id: "yala-park", name: "Yala National Park", category: "wildlife", rating: 4.6, time: "Full day", image: "/lagoon.jpeg" },
  { id: "ella-hike", name: "Ella Rock Hike", category: "mountain", rating: 4.5, time: "3–4 hours", image: "/sunset.jpeg" },
  { id: "diyaluma-falls", name: "Diyaluma Falls", category: "waterfall", rating: 4.7, time: "2–4 hours", image: "/sunset.jpeg" },
];

export default function Tourism() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return attractions.filter((a) => {
      const matchText = a.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = activeCategory === "all" || a.category === activeCategory;
      return matchText && matchCat;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 pt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img src="/beach.jpg" alt="Tourism" className="w-full h-[260px] object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold">Tourism</h1>
            <p className="mt-2 text-white/90 max-w-xl">
              Explore attractions by category, search places, and open details to learn more.
            </p>

            {/* Search */}
            <div className="mt-6 max-w-2xl w-full">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search beaches, forts, temples..."
                  className="w-full px-5 py-3 rounded-xl outline-none text-black text-lg border border-gray-200 focus:ring-2 focus:ring-black"
                />
              
            </div>

            {/* Quick buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl font-semibold border transition ${
                  activeCategory === "all"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory("beach")}
                className={`px-4 py-2 rounded-xl font-semibold border transition ${
                  activeCategory === "beach"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                Beaches
              </button>
              <button
                onClick={() => setActiveCategory("heritage")}
                className={`px-4 py-2 rounded-xl font-semibold border transition ${
                  activeCategory === "heritage"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                Heritage
              </button>
              <button
                onClick={() => setActiveCategory("wildlife")}
                className={`px-4 py-2 rounded-xl font-semibold border transition ${
                  activeCategory === "wildlife"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                Wildlife
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-gray-600 mt-1">Pick a category to filter attractions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-6">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition text-left bg-white ${
                activeCategory === c.key ? "ring-2 ring-black" : ""
              }`}
              title={`Filter: ${c.label}`}
            >
              <img src={c.image} alt={c.label} className="w-full h-[170px] object-cover" />
              <div className="p-4">
                <div className="text-lg font-bold">{c.label}</div>
                <div className="text-sm text-gray-600 mt-1">Tap to explore</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ATTRACTIONS */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-2xl font-bold">Featured Attractions</h2>
        <p className="text-gray-600 mt-1">
          Click a place to open details (later add reviews, maps, tickets, etc.).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-6">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/attractions/${a.id}`)}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white text-left"
            >
              <img src={a.image} alt={a.name} className="w-full h-[200px] object-cover" />
              <div className="p-4">
                <div className="font-bold text-lg">{a.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  ⏱ {a.time} • ⭐ {a.rating}
                </div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-gray-600">No attractions found. Try another search or category.</div>
          )}
        </div>
      </section>
    </div>
  );
}