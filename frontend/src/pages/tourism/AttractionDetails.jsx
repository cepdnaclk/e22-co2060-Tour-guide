import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { attractions } from "./attractionsData";
import {
  MapPin,
  ExternalLink,
  Compass,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Shirt,
  Footprints,
  ChevronLeft,
  Sun,
  CloudRain,
  Navigation
} from "lucide-react";

// Local Fallbacks
import beachesData from "../../../beaches.json";
import mountainsData from "../../../mountains.json";
import heritageData from "../../../heritage.json";
import wildlifeData from "../../../wildlife.json";
import waterfallsData from "../../../waterfalls.json";
import cityData from "../../../city.json";

function generateBestSeason(district, category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("mountain")) {
    return "Jan – Mar & Jul – Aug";
  }
  if (cat.includes("waterfall")) {
    return "Jun – Sep & Nov – Jan";
  }
  if (cat.includes("wildlife")) {
    return "May – Sep (Dry Sightings)";
  }
  if (cat.includes("beach")) {
    return ["Galle", "Matara", "Hambantota", "Colombo", "Kalutara", "Puttalam"].includes(district)
      ? "Nov – Apr (Dry)"
      : "May – Oct (Dry)";
  }
  return "Year-Round";
}

function generateVibe(name, category) {
  const cat = (category || "").toLowerCase();
  const lname = (name || "").toLowerCase();
  if (cat.includes("beach")) {
    return lname.includes("secret") || lname.includes("jungle") || lname.includes("talalla")
      ? "Quiet & Secluded"
      : lname.includes("mirissa") || lname.includes("hikkaduwa") || lname.includes("unawatuna")
      ? "Vibrant & Social"
      : "Scenic & Relaxing";
  }
  if (cat.includes("mountain")) {
    return lname.includes("adam") ? "Sacred Pilgrimage" : "Adventure & Vistas";
  }
  if (cat.includes("heritage")) {
    return lname.includes("fort") || lname.includes("ruins") || lname.includes("palace") || lname.includes("museum")
      ? "Historic & Antiquity"
      : "Sacred & Peaceful";
  }
  if (cat.includes("wildlife")) {
    return lname.includes("botanical") || lname.includes("garden") ? "Serene Flora" : "Wild & Adventure";
  }
  if (cat.includes("waterfall")) {
    return "Mist Spray & Cool Valleys";
  }
  return "Bustling Urban Commerce";
}

function generateActivities(name, category) {
  const cat = (category || "").toLowerCase();
  const lname = (name || "").toLowerCase();
  if (cat.includes("beach")) {
    return lname.includes("weligama") || lname.includes("hikkaduwa") || lname.includes("arugam") || lname.includes("hiriketiya")
      ? "Surfing & Snorkeling"
      : lname.includes("mirissa") || lname.includes("secret") || lname.includes("polhena") || lname.includes("dalawella")
      ? "Whale Watching & Swimming"
      : "Calm Swims & Relaxation";
  }
  if (cat.includes("mountain")) {
    return "Hiking, Trekking, Camping";
  }
  if (cat.includes("heritage")) {
    return "Sightseeing, Historical Guided Tour";
  }
  if (cat.includes("wildlife")) {
    return lname.includes("botanical") || lname.includes("sanctuary") || lname.includes("zoo") || lname.includes("garden")
      ? "Walking & Nature Tours"
      : "4x4 Safari Jeep Ride";
  }
  return "Sightseeing, Photography, Exploration";
}

function generateAccess(name, category) {
  const cat = (category || "").toLowerCase();
  const lname = (name || "").toLowerCase();
  if (cat.includes("waterfall")) {
    return lname.includes("devon") || lname.includes("clair") || lname.includes("ramboda")
      ? "Roadside Viewpoint"
      : "Short Jungle Trek";
  }
  if (cat.includes("mountain")) {
    return "Mountain trail climbing";
  }
  return "Easy road/pedestrian access";
}

function generateDressCode(name, category) {
  const cat = (category || "").toLowerCase();
  const lname = (name || "").toLowerCase();
  if (cat.includes("heritage")) {
    return lname.includes("temple") || lname.includes("viharaya") || lname.includes("kovil") || lname.includes("shrine") || lname.includes("dagoba") || lname.includes("stupa") || lname.includes("statue")
      ? "Modest (Cover Shoulders & Knees)"
      : "Casual Wear";
  }
  return null;
}

export default function AttractionDetails() {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check static data
    const staticItem = attractions.find((a) => a.id === id);
    if (staticItem) {
      setAttraction(staticItem);
      setLoading(false);
      return;
    }

    // 2. Check local fallback (if id starts with local-)
    if (id && id.startsWith("local-")) {
      const idx = parseInt(id.replace("local-", ""), 10);
      let localData = [];
      const cat = (category || "").toLowerCase();
      if (cat.includes("beach")) localData = beachesData;
      else if (cat.includes("mountain")) localData = mountainsData;
      else if (cat.includes("heritage")) localData = heritageData;
      else if (cat.includes("wildlife")) localData = wildlifeData;
      else if (cat.includes("waterfall")) localData = waterfallsData;
      else if (cat.includes("city")) localData = cityData;

      const localItem = localData[idx];
      if (localItem) {
        const mappedItem = {
          id,
          name: localItem.name,
          category: category,
          rating: (4.5 + (localItem.name.length % 5) * 0.1).toFixed(1),
          time: localItem.name.toLowerCase().includes("arugam") || localItem.name.toLowerCase().includes("mirissa") ? "Full Day" : "2 – 4 Hours",
          image: localItem.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          description: localItem.description || "A gorgeous spot in Sri Lanka to explore and experience the local culture, scenery, and warm hospitality.",
          district: localItem.district,
          bestSeason: generateBestSeason(localItem.district, category),
          vibe: generateVibe(localItem.name, category),
          activities: generateActivities(localItem.name, category),
          access: generateAccess(localItem.name, category),
          dressCode: generateDressCode(localItem.name, category),
          googleMapsUrl: localItem.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(localItem.name)}`
        };
        setAttraction(mappedItem);
      }
      setLoading(false);
      return;
    }

    // 3. Fetch from Firestore
    const fetchFromFirestore = async () => {
      try {
        setLoading(true);
        const categoryMap = {
          beaches: "Beaches",
          beach: "Beaches",
          mountains: "Mountains",
          mountain: "Mountains",
          heritage: "Heritage",
          wildlife: "Wildlife",
          waterfalls: "Waterfalls",
          waterfall: "Waterfalls",
          city: "City",
          cities: "City"
        };
        const collectionName = categoryMap[category.toLowerCase()] || "Beaches";
        const docRef = doc(db, "Tourism", collectionName, "Places", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const mappedItem = {
            id: docSnap.id,
            name: docData.name,
            category: category,
            rating: (4.5 + (docData.name.length % 5) * 0.1).toFixed(1),
            time: docData.name.toLowerCase().includes("arugam") || docData.name.toLowerCase().includes("mirissa") ? "Full Day" : "2 – 4 Hours",
            image: docData.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
            description: docData.description || "A gorgeous spot in Sri Lanka to explore and experience the local culture, scenery, and warm hospitality.",
            district: docData.district,
            bestSeason: generateBestSeason(docData.district, category),
            vibe: generateVibe(docData.name, category),
            activities: generateActivities(docData.name, category),
            access: generateAccess(docData.name, category),
            dressCode: generateDressCode(docData.name, category),
            googleMapsUrl: docData.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(docData.name)}`
          };
          setAttraction(mappedItem);
        }
      } catch (err) {
        console.error("Error loading place from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromFirestore();
  }, [category, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <Compass className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium animate-pulse">Loading destination details...</p>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <Compass className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Attraction Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          We couldn't find details for this destination. It may be currently offline.
        </p>
        <button
          onClick={() => navigate("/tourism")}
          className="mt-6 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-semibold rounded-xl transition shadow"
        >
          Back to Tourism
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 pb-20">
      {/* PREMIUM HEADER HERO */}
      <header className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-100"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/60 to-transparent" />

        {/* Floating Actions on Top */}
        <div className="absolute top-6 left-6 right-6 max-w-6xl mx-auto flex items-center justify-between text-white z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950/55 hover:bg-slate-950/80 backdrop-blur-md font-semibold text-sm border border-white/15 shadow-sm transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Hero Title & District pill */}
        <div className="absolute bottom-10 left-6 right-6 max-w-6xl mx-auto text-white flex flex-col items-start z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/10 mb-3 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-amber-300" />
            {attraction.category}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
            {attraction.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/90 flex items-center gap-1.5 font-medium drop-shadow-sm">
            <MapPin className="h-4.5 w-4.5 text-rose-450 fill-rose-500/20" />
            {attraction.district} District • Sri Lanka
          </p>
        </div>
      </header>

      {/* DETAILED CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: Main info & structured details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-teal-600" />
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Compass className="h-5 w-5 text-teal-600" />
                Destination Description
              </h2>
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line font-normal">
                {attraction.description}
              </p>
            </div>

            {/* Travel Parameters Pill Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-600" />
                Plan Your Visit
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* 1. Best Season */}
                <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-teal-50/40 border border-teal-100/50">
                  <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-teal-850 uppercase tracking-wider">Best Season</div>
                    <div className="text-slate-800 font-bold text-sm sm:text-base mt-1">
                      {attraction.bestSeason}
                    </div>
                  </div>
                </div>

                {/* 2. Vibe */}
                <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-amber-50/40 border border-amber-100/50">
                  <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-850 uppercase tracking-wider">Vibe & Style</div>
                    <div className="text-slate-800 font-bold text-sm sm:text-base mt-1">
                      {attraction.vibe}
                    </div>
                  </div>
                </div>

                {/* 3. Activities */}
                <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50">
                  <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-850 uppercase tracking-wider">Key Activities</div>
                    <div className="text-slate-800 font-bold text-sm sm:text-base mt-1">
                      {attraction.activities}
                    </div>
                  </div>
                </div>

                {/* 4. Access Method */}
                <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/50">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Footprints className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-850 uppercase tracking-wider">Access Method</div>
                    <div className="text-slate-800 font-bold text-sm sm:text-base mt-1">
                      {attraction.access}
                    </div>
                  </div>
                </div>

                {/* 5. Dress Code */}
                {attraction.dressCode && (
                  <div className="flex gap-3.5 items-start p-4 rounded-2xl bg-rose-50/40 border border-rose-100/50 sm:col-span-2">
                    <div className="p-3 bg-rose-100 text-rose-800 rounded-xl">
                      <Shirt className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-rose-850 uppercase tracking-wider">Dress Code / Dress Guidelines</div>
                      <div className="text-slate-800 font-bold text-sm sm:text-base mt-1">
                        {attraction.dressCode}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Quick summary card & Map actions */}
          <div className="space-y-6">
            
            {/* Quick Metrics Glassmorphic Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-sm font-bold border border-amber-100">
                  <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                  {attraction.rating}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold bg-slate-50 px-3 py-1 rounded-xl">
                  <Clock className="h-4.5 w-4.5" />
                  {attraction.time}
                </div>
              </div>

              <h3 className="font-bold text-xl text-slate-900 mb-2">{attraction.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Recommended visit time includes exploration, trekking, and photo stops. Ensure you respect environment guides.
              </p>

              {/* Weather Tips Segment */}
              <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-150/20 mb-6 flex gap-3 items-center">
                {attraction.bestSeason.toLowerCase().includes("year-round") ? (
                  <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />
                ) : (
                  <CloudRain className="h-6 w-6 text-teal-600" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-700">Recommended Guide</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Best weather conditions are during the dry monsoons.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {attraction.googleMapsUrl && (
                  <a
                    href={attraction.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 text-sm font-semibold shadow-md transition duration-200"
                  >
                    <Navigation className="h-4 w-4 fill-white" />
                    Navigate in Google Maps
                  </a>
                )}
                
                <button
                  onClick={() => {
                    const routes = {
                      beach: "/tourism/beaches",
                      beaches: "/tourism/beaches",
                      mountain: "/tourism/mountains",
                      mountains: "/tourism/mountains",
                      heritage: "/tourism/heritage",
                      wildlife: "/tourism/wildlife",
                      waterfall: "/tourism/waterfalls",
                      waterfalls: "/tourism/waterfalls",
                      city: "/tourism/city",
                      cities: "/tourism/city"
                    };
                    const targetRoute = routes[(category || "").toLowerCase()] || "/tourism";
                    navigate(targetRoute);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition"
                >
                  <Compass className="h-4 w-4" />
                  Explore Category Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
