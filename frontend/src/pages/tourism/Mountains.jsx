import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PlacesMap from "../../components/PlacesMap";
import { MapPin, ExternalLink, Compass, Mountain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mountainsData from "../../../mountains.json";

export default function Mountains() {
  const navigate = useNavigate();
  // Use mountains from local mountains.json as initial state
  const [mountains, setMountains] = useState(() => {
    return (mountainsData || []).map((m, idx) => ({
      id: `local-${idx}`,
      ...m,
    }));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch from subcollection path: Tourism/Mountains/Places
        const colRef = collection(db, "Tourism", "Mountains", "Places");
        const snapshot = await getDocs(colRef);
        
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((mt) => mt.isActive === true);
          
        if (data.length > 0) {
          setMountains(data);
        }
      } catch (err) {
        console.warn("Firestore fetch failed, using local mountains.json fallback data:", err.message);
        // Gracefully swallow error so the user still sees the fallback local data
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
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
            src="/mountain.jpg"
            alt="Mountains in Sri Lanka"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
            <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Mountain className="h-3.5 w-3.5 animate-pulse" />
              Alpine Guide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Mountains & Hiking
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Ascend to breathtaking peaks, explore mist-covered tea hills, and hike Sri Lanka's finest trails.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-gray-100">
            <div className="inline-block animate-bounce p-3 bg-emerald-50 text-emerald-600 rounded-full mb-3">
              <Compass className="h-8 w-8" />
            </div>
            <p className="text-gray-600 font-medium">Loading majestic hiking trails...</p>
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
            {mountains.length > 0 && (
              <div className="mb-10">
                <PlacesMap
                  title="Interactive Hiking & Peaks Map"
                  places={mountains}
                  height="450px"
                />
              </div>
            )}

            {/* MOUNTAINS CARDS GRID */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Explore Trails & Peaks</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing {mountains.length} gorgeous destinations around the island
                  </p>
                </div>
              </div>

              {mountains.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-600">No active peaks found in the database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
                  {mountains.slice(0, showAll ? undefined : 9).map((mountain) => (
                    <div
                      key={mountain.id}
                      onClick={() => navigate(`/attractions/mountains/${mountain.id}`)}
                      className="cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden group"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                        <img
                          src={mountain.imageUrl || "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=600&q=80"}
                          alt={mountain.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Top Meta row */}
                        <div className="flex items-center justify-between mb-3">
                          {/* District Badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 uppercase">
                            <MapPin className="h-3 w-3" />
                            {mountain.district}
                          </div>
                          {/* Rating Badge */}
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            ★ {(4.6 + (mountain.name.length % 4) * 0.1).toFixed(1)}
                          </div>
                        </div>

                        {/* Mountain Name */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                          {mountain.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                          {mountain.description}
                        </p>

                        {/* Structured Details Box */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100/50 text-xs text-gray-600">
                          {/* Recommended Season */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Best Season:</span>
                            <span className="font-semibold text-emerald-800">
                              Jan – Mar & Jul – Aug
                            </span>
                          </div>
                          {/* Difficulty */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Difficulty:</span>
                            <span className="font-semibold text-slate-800">
                              {mountain.name.toLowerCase().includes("adam's peak") || mountain.name.toLowerCase().includes("kirigalpotta") || mountain.name.toLowerCase().includes("pidurutalagala")
                                ? "Challenging Climb"
                                : mountain.name.toLowerCase().includes("ella rock") || mountain.name.toLowerCase().includes("diyaluma")
                                ? "Moderate Hike"
                                : "Scenic Walk"}
                            </span>
                          </div>
                          {/* Vibe */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Vibe:</span>
                            <span className="font-semibold text-slate-800">
                              {mountain.name.toLowerCase().includes("adam")
                                ? "Sacred Pilgrimage"
                                : "Adventure & Vistas"}
                            </span>
                          </div>
                          {/* Recommended Stay */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Recommended Stay:</span>
                            <span className="font-semibold text-slate-800">
                              {mountain.name.toLowerCase().includes("adam") || mountain.name.toLowerCase().includes("kirigalpotta")
                                ? "6 – 8 Hours"
                                : "3 – 4 Hours"}
                            </span>
                          </div>
                        </div>

                        {/* Action Link */}
                        {mountain.googleMapsUrl && (
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoogleMaps(mountain.googleMapsUrl);
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

              {!showAll && mountains.length > 9 && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold shadow-xs transition duration-200 cursor-pointer"
                  >
                    See All ({mountains.length})
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
          <p className="text-lg font-bold text-gray-900">Plan Your Summit Climb</p>
          <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto leading-relaxed">
            Ensure you have proper footwear, hydration, and trail guide contacts. The best season for climbing the hill country is typically from December to April.
          </p>
        </div>
      </footer>
    </div>
  );
}
