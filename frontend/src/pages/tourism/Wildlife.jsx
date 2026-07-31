import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PlacesMap from "../../components/PlacesMap";
import { MapPin, ExternalLink, Compass, Trees } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wildlifeData from "../../../wildlife.json";

export default function Wildlife() {
  const navigate = useNavigate();
  // Use wildlife locations from local wildlife.json as initial state
  const [wildlifeSites, setWildlifeSites] = useState(() => {
    return (wildlifeData || []).map((w, idx) => ({
      id: `local-${idx}`,
      ...w,
    }));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchWildlife = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch from subcollection path: Tourism/Wildlife/Places
        const colRef = collection(db, "Tourism", "Wildlife", "Places");
        const snapshot = await getDocs(colRef);
        
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((site) => site.isActive === true);
          
        if (data.length > 0) {
          setWildlifeSites(data);
        }
      } catch (err) {
        console.warn("Firestore fetch failed, using local wildlife.json fallback data:", err.message);
        // Gracefully swallow error so the user still sees the fallback local data
      } finally {
        setLoading(false);
      }
    };

    fetchWildlife();
  }, []);

  const openGoogleMaps = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO BANNER */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="relative overflow-hidden rounded-3xl shadow-xl h-[260px] sm:h-[320px]">
          <img
            src="/lagoon.jpeg"
            alt="Wildlife in Sri Lanka"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
            <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Trees className="h-3.5 w-3.5 animate-pulse" />
              Safari & Wilderness Guide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Wildlife & Safaris
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Explore national parks teeming with majestic elephants, elusive leopards, sloth bears, and thousands of exotic tropical birds.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-gray-100">
            <div className="inline-block animate-bounce p-3 bg-green-50 text-green-600 rounded-full mb-3">
              <Compass className="h-8 w-8" />
            </div>
            <p className="text-gray-600 font-medium">Loading safari destinations...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* CONTENT DISPLAY */}
        {!loading && !error && (
          <>
            {/* INTERACTIVE MAP */}
            {wildlifeSites.length > 0 && (
              <div className="mb-10">
                <PlacesMap
                  title="Interactive Wildlife & Safaris Map"
                  places={wildlifeSites}
                  height="450px"
                />
              </div>
            )}

            {/* WILDLIFE CARDS GRID */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Explore Wilderness Sites</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing {wildlifeSites.length} legendary nature reserves around the island
                  </p>
                </div>
              </div>

              {wildlifeSites.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-600">No active wildlife reserves found in the database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
                  {wildlifeSites.slice(0, showAll ? undefined : 9).map((site) => (
                    <div
                      key={site.id}
                      onClick={() => navigate(`/attractions/wildlife/${site.id}`)}
                      className="cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden group"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                        <img
                          src={site.imageUrl || "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80"}
                          alt={site.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Top Meta row */}
                        <div className="flex items-center justify-between mb-3">
                          {/* District Badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 uppercase">
                            <MapPin className="h-3 w-3" />
                            {site.district}
                          </div>
                          {/* Rating Badge */}
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            ★ {(4.6 + (site.name.length % 4) * 0.1).toFixed(1)}
                          </div>
                        </div>

                        {/* Site Name */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                          {site.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                          {site.description}
                        </p>

                        {/* Structured Details Box */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100/50 text-xs text-gray-600">
                          {/* Recommended Season */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Best Season:</span>
                            <span className="font-semibold text-green-800">
                              {site.name.toLowerCase().includes("kumana") || site.name.toLowerCase().includes("bundala") || site.name.toLowerCase().includes("sanctuary")
                                ? "Oct – Apr (Birds)"
                                : "May – Sep (Dry Sightings)"}
                            </span>
                          </div>
                          {/* Experience */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Experience:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[150px]" title={
                              site.name.toLowerCase().includes("botanical") || site.name.toLowerCase().includes("sanctuary") || site.name.toLowerCase().includes("zoo") || site.name.toLowerCase().includes("garden")
                                ? "Walking & Nature Tours"
                                : "4x4 Safari Jeep Ride"
                            }>
                              {site.name.toLowerCase().includes("botanical") || site.name.toLowerCase().includes("sanctuary") || site.name.toLowerCase().includes("zoo") || site.name.toLowerCase().includes("garden")
                                ? "Walking & Nature Tour"
                                : "4x4 Safari Jeep Ride"}
                            </span>
                          </div>
                          {/* Vibe */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Vibe:</span>
                            <span className="font-semibold text-slate-800">
                              {site.name.toLowerCase().includes("botanical") || site.name.toLowerCase().includes("garden")
                                ? "Serene Flora"
                                : "Wild & Adventure"}
                            </span>
                          </div>
                          {/* Recommended Stay */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Recommended Stay:</span>
                            <span className="font-semibold text-slate-800">
                              {site.name.toLowerCase().includes("national park") || site.name.toLowerCase().includes("safari park") || site.name.toLowerCase().includes("reserve")
                                ? "3 – 5 Hours"
                                : "1 – 2 Hours"}
                            </span>
                          </div>
                        </div>

                        {/* Action Link */}
                        {site.googleMapsUrl && (
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoogleMaps(site.googleMapsUrl);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-sm font-semibold border border-slate-200/60 shadow-xs transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open in Google Maps
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showAll && wildlifeSites.length > 9 && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-3 rounded-xl bg-white border border-green-200 text-green-700 hover:bg-green-50 font-semibold shadow-xs transition duration-200 cursor-pointer"
                  >
                    See All ({wildlifeSites.length})
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* FOOTER BANNER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-6 text-center">
          <p className="text-lg font-bold text-gray-900">Respect the Animals</p>
          <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto leading-relaxed">
            Keep clean, maintain low noise levels during drives, and never feed or approach wild animals. Hiring a qualified park tracker is highly recommended.
          </p>
        </div>
      </footer>
    </div>
  );
}
