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

import { attractions } from "./attractionsData";

export default function Tourism() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSecondBatch, setShowSecondBatch] = useState(false);

  // Reset pagination if filters change
  React.useEffect(() => {
    setShowSecondBatch(false);
  }, [query, activeCategory]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return attractions.filter((a) => {
      const matchText =
        !q ||
        (a.name || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q) ||
        (a.district || "").toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.vibe || "").toLowerCase().includes(q) ||
        (a.activities || "").toLowerCase().includes(q);

      const matchCat = activeCategory === "all" || a.category === activeCategory;

      return matchText && matchCat;
    });
  }, [query, activeCategory]);

  const displayedAttractions = useMemo(() => {
    // If user is actively searching, show all search matches immediately without slicing
    if (query.trim()) return filtered;
    return showSecondBatch ? filtered.slice(12, 24) : filtered.slice(0, 12);
  }, [filtered, showSecondBatch, query]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[420px] sm:min-h-[380px] flex items-center">
          <img
            src="/beach.jpg"
            alt="Tourism"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          <div className="relative z-10 w-full flex flex-col justify-center p-6 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Tourism</h1>

            <p className="mt-2 text-base sm:text-lg text-white/90 max-w-md sm:max-w-xl leading-relaxed">
              Explore attractions by category, search places, and open details to learn more.
            </p>

            {/* Search */}
            <div className="mt-5 w-full max-w-2xl relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search beaches, forts, temples, mountains..."
                className="w-full px-5 py-3.5 pl-12 rounded-xl outline-none text-gray-900 bg-white placeholder-gray-500 text-base sm:text-lg border-2 border-transparent focus:border-brand-teal focus:ring-4 focus:ring-teal-500/30 shadow-lg transition-all"
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 sm:gap-3 mt-4 flex-wrap">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => navigate("/tourism/beaches")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                Beaches
              </button>
              <button
                onClick={() => navigate("/tourism/mountains")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                Mountains
              </button>
              <button
                onClick={() => navigate("/tourism/heritage")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                Heritage
              </button>
              <button
                onClick={() => navigate("/tourism/wildlife")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                Wildlife
              </button>
              <button
                onClick={() => navigate("/tourism/waterfalls")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                Waterfalls
              </button>
              <button
                onClick={() => navigate("/tourism/city")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20 cursor-pointer"
              >
                City
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-gray-600 mt-1">Pick a category to filter attractions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-6">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                if (c.key === "beach") {
                  navigate("/tourism/beaches");
                } else if (c.key === "mountain") {
                  navigate("/tourism/mountains");
                } else if (c.key === "heritage") {
                  navigate("/tourism/heritage");
                } else if (c.key === "wildlife") {
                  navigate("/tourism/wildlife");
                } else if (c.key === "waterfall") {
                  navigate("/tourism/waterfalls");
                } else if (c.key === "city") {
                  navigate("/tourism/city");
                } else {
                  setActiveCategory(c.key);
                }
              }}
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14">
        <h2 className="text-2xl font-bold">Featured Attractions</h2>
        <p className="text-gray-600 mt-1">
          Click a place to open details (later add reviews, maps, tickets, etc.).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-7 mt-6">
          {displayedAttractions.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/attractions/${a.category}/${a.id}`)}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white text-left flex flex-col h-full"
            >
              <div className="h-[200px] w-full overflow-hidden">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="font-bold text-lg text-gray-900 leading-snug line-clamp-2">{a.name}</div>
                <div className="text-sm text-gray-600 mt-2 flex items-center justify-between">
                  <span>⏱ {a.time}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    ★ {a.rating}
                  </span>
                </div>
              </div>
            </button>
          ))}

          {displayedAttractions.length === 0 && (
            <div className="text-gray-600 col-span-full py-8 text-center">No attractions found. Try another search or category.</div>
          )}
        </div>

        {filtered.length > 12 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowSecondBatch(!showSecondBatch)}
              className="px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold shadow-md transition duration-200 cursor-pointer"
            >
              {showSecondBatch ? "Show Previous" : "See More Attractions"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
