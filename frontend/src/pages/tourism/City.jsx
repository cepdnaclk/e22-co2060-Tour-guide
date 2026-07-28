import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PlacesMap from "../../components/PlacesMap";
import PageNavigation from "../../components/PageNavigation";
import { MapPin, ExternalLink, Compass, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cityData from "../../../city.json";

export default function City() {
  const navigate = useNavigate();
  // Use city locations from local city.json as initial state
  const [citySites, setCitySites] = useState(() => {
    return (cityData || []).map((c, idx) => ({
      id: `local-${idx}`,
      ...c,
    }));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch from subcollection path: Tourism/City/Places
        const colRef = collection(db, "Tourism", "City", "Places");
        const snapshot = await getDocs(colRef);
        
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((site) => site.isActive === true);
          
        if (data.length > 0) {
          setCitySites(data);
        }
      } catch (err) {
        console.warn("Firestore fetch failed, using local city.json fallback data:", err.message);
        // Gracefully swallow error so the user still sees the fallback local data
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
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
            src="/kandy.jpg"
            alt="City & Shopping in Sri Lanka"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
            <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Building className="h-3.5 w-3.5 animate-pulse" />
              Urban & Commercial Guide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              City & Shopping
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90 font-light leading-relaxed">
              Explore bustling street bazaars, modern malls, historic colonial arcades, and the vibrant city life of Colombo and Kandy.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Navigation Breadcrumb */}
        <PageNavigation className="mb-6" />

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-gray-100">
            <div className="inline-block animate-bounce p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
              <Compass className="h-8 w-8" />
            </div>
            <p className="text-gray-600 font-medium">Loading urban destinations...</p>
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
            {citySites.length > 0 && (
              <div className="mb-10">
                <PlacesMap
                  title="Interactive Cities & Shopping Map"
                  places={citySites}
                  height="450px"
                />
              </div>
            )}

            {/* CITY CARDS GRID */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Explore Shopping & Cities</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing {citySites.length} popular metropolitan spots around the island
                  </p>
                </div>
              </div>

              {citySites.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-600">No active urban hotspots found in the database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
                  {citySites.slice(0, showAll ? undefined : 9).map((site) => (
                    <div
                      key={site.id}
                      onClick={() => navigate(`/attractions/city/${site.id}`)}
                      className="cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden group"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                        <img
                          src={site.imageUrl || "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"}
                          alt={site.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Top Meta row */}
                        <div className="flex items-center justify-between mb-3">
                          {/* District Badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase">
                            <MapPin className="h-3 w-3" />
                            {site.district}
                          </div>
                          {/* Rating Badge */}
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            ★ {(4.4 + (site.name.length % 5) * 0.1).toFixed(1)}
                          </div>
                        </div>

                        {/* Site Name */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
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
                            <span className="font-semibold text-indigo-800">
                              Year-Round
                            </span>
                          </div>
                          {/* Focus */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Focus:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[150px]" title={
                              site.name.toLowerCase().includes("mall") || site.name.toLowerCase().includes("centre") || site.name.toLowerCase().includes("arcade") || site.name.toLowerCase().includes("plaza")
                                ? "Shopping Malls & Dining"
                                : "Local Bazaars & Crafts"
                            }>
                              {site.name.toLowerCase().includes("mall") || site.name.toLowerCase().includes("centre") || site.name.toLowerCase().includes("arcade") || site.name.toLowerCase().includes("plaza")
                                ? "Shopping Malls & Dining"
                                : "Local Bazaars & Crafts"}
                            </span>
                          </div>
                          {/* Vibe */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Vibe:</span>
                            <span className="font-semibold text-slate-800">
                              Bustling Urban Commerce
                            </span>
                          </div>
                          {/* Recommended Stay */}
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">Recommended Stay:</span>
                            <span className="font-semibold text-slate-800">
                              2 – 4 Hours
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

              {!showAll && citySites.length > 9 && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-3 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold shadow-xs transition duration-200 cursor-pointer"
                  >
                    See All ({citySites.length})
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
          <p className="text-lg font-bold text-gray-900">Experience Local Commerce</p>
          <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto leading-relaxed">
            Ensure you negotiate politely when bargaining at street markets. Public transport or local tuk-tuks are usually the easiest ways to navigate dense city centers.
          </p>
        </div>
      </footer>
    </div>
  );
}
