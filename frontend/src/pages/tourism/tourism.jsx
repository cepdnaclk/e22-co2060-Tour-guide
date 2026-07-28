import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "../../components/PageNavigation";

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
    return attractions.filter((a) => {
      const matchText = a.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = activeCategory === "all" || a.category === activeCategory;
      return matchText && matchCat;
    });
  }, [query, activeCategory]);

  const displayedAttractions = useMemo(() => {
    return showSecondBatch ? filtered.slice(12, 24) : filtered.slice(0, 12);
  }, [filtered, showSecondBatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

          <PageNavigation className="mb-6" />
          
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/beach.jpg"
            alt="Tourism"
            className="w-full h-[420px] sm:h-[360px] md:h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Tourism</h1>

            <p className="mt-2 text-base sm:text-lg text-white/90 max-w-md sm:max-w-xl leading-relaxed">
              Explore attractions by category, search places, and open details to learn more.
            </p>

            {/* Search */}
            <div className="mt-4 w-full max-w-full sm:max-w-2xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search beaches, forts, temples..."
                className="w-full px-4 sm:px-5 py-3 rounded-xl outline-none text-black text-base sm:text-lg border border-gray-200 focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 sm:gap-3 mt-4 flex-wrap">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition ${
                  activeCategory === "all"
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => navigate("/tourism/beaches")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Beaches
              </button>
              <button
                onClick={() => navigate("/tourism/mountains")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Mountains
              </button>
              <button
                onClick={() => navigate("/tourism/heritage")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Heritage
              </button>
              <button
                onClick={() => navigate("/tourism/wildlife")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Wildlife
              </button>
              <button
                onClick={() => navigate("/tourism/waterfalls")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Waterfalls
              </button>
              <button
                onClick={() => navigate("/tourism/city")}
                className="px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition bg-white/10 text-white border-white/30 hover:bg-white/20"
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
                <div className="font-bold text-lg text-gray-900 line-clamp-1">{a.name}</div>
                <div className="text-sm text-gray-600 mt-1 flex items-center justify-between">
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
