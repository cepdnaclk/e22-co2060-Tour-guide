import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Map, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";


function getPlaceImage(place) {
  return place.imageUrl || "/kandy.jpg";
}

function getType(place) {
  return String(place.placeType || place.placetype || place.category || "")
    .toLowerCase()
    .trim();
}

function normalizeDistrictSlug(place) {
  return String(place.district || place.districtName || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function formatDistrictName(slug) {
  return String(slug || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function PlaceCard({ place }) {
  const openDirections = () => {
    if (!place?.lat || !place?.lng) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-w-[250px] max-w-[250px] h-[340px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0 flex flex-col hover:shadow-md transition">
      <img
        src={getPlaceImage(place)}
        alt={place.name}
        onError={(e) => {
          e.currentTarget.src = "/kandy.jpg";
        }}
        className="w-full h-[140px] object-cover flex-shrink-0"
      />

      <div className="p-4 relative flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 pr-6">{place.name}</h3>

          <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
            {(place.placeType || place.placetype || place.category || "place").replaceAll("_", " ")}
          </p>

          {(place.districtName || place.district) && (
            <p className="text-xs text-gray-500 mt-1 capitalize">
              📍 {String(place.districtName || place.district).replaceAll("-", " ")}
            </p>
          )}

          {place.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>

        <button
          onClick={openDirections}
          title="View on map"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white transition flex items-center justify-center cursor-pointer"
        >
          <Map size={18} />
        </button>
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  icon,
  places,
  categoryKey,
  onDistrictSelect,
  searchValue,
  onSearchChange,
}) {
  if (!places || places.length === 0) return null;

  const districtOptions = Array.from(
    new Set(places.map((p) => normalizeDistrictSlug(p)).filter(Boolean))
  ).sort();

  const [visibleCount, setVisibleCount] = useState(8);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold">
            {title}
            <span className="text-gray-500 text-lg ml-2">({places.length})</span>
          </h2>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(categoryKey, e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            defaultValue=""
            onChange={(e) => {
              const selectedDistrict = e.target.value;
              if (!selectedDistrict) return;
              onDistrictSelect(selectedDistrict, categoryKey);
            }}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select district</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>
                {formatDistrictName(district)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {places.slice(0, visibleCount).map((place, index) => (
          <PlaceCard key={place.id || index} place={place} />
        ))}
      </div>

       {places.length > visibleCount && (
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => setVisibleCount(visibleCount + 8)}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    See More
                </button>
            </div>
        )}
    </section>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [categorySearch, setCategorySearch] = useState({
    food: "",
    stay: "",
    fuel: "",
    transport: "",
    rentals: "",
    repairs: "",
    hospitals: "",
    pharmacies: "",
    police: "",
  });

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "places"));

        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((p) => p.isActive !== false && p.isactive !== false);

        setPlaces(data);
      } catch (error) {
        console.error("Failed to load places:", error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    const searchTerm = query.toLowerCase().trim();

    return places.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const district = String(p.districtName || p.district || "").toLowerCase();
      const type = getType(p);
      const desc = String(p.description || "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        district.includes(searchTerm) ||
        type.includes(searchTerm) ||
        desc.includes(searchTerm);

      if (!matchesSearch) return false;

      if (activeCategory === "all") return true;

      if (activeCategory === "food") {
        return ["food", "restaurant", "cafe", "fast_food"].includes(type);
      }

      if (activeCategory === "stay") {
        return ["stay", "hotel", "guest_house", "hostel"].includes(type);
      }

      if (activeCategory === "fuel") {
        return ["petrol_shed", "fuel"].includes(type);
      }

      if (activeCategory === "transport") {
        return ["bus_stand", "railway_station"].includes(type);
      }

      if (activeCategory === "rentals") {
        return ["car_rental", "bike_rental"].includes(type);
      }

      if (activeCategory === "repairs") {
        return ["car_repair", "bike_repair", "mechanic"].includes(type);
      }

      if (activeCategory === "services") {
        return ["hospital", "pharmacy", "police_station"].includes(type);
      }

      return true;
    });
  }, [places, query, activeCategory]);

  const groupedPlaces = useMemo(() => {
    const base = {
      food: filteredPlaces.filter((p) =>
        ["food", "restaurant", "cafe", "fast_food"].includes(getType(p))
      ),
      stay: filteredPlaces.filter((p) =>
        ["stay", "hotel", "guest_house", "hostel"].includes(getType(p))
      ),
      fuel: filteredPlaces.filter((p) =>
        ["petrol_shed", "fuel"].includes(getType(p))
      ),
      transport: filteredPlaces.filter((p) =>
        ["bus_stand", "railway_station"].includes(getType(p))
      ),
      rentals: filteredPlaces.filter((p) =>
        ["car_rental", "bike_rental"].includes(getType(p))
      ),
      repairs: filteredPlaces.filter((p) =>
        ["car_repair", "bike_repair", "mechanic"].includes(getType(p))
      ),
      hospitals: filteredPlaces.filter((p) => getType(p) === "hospital"),
      pharmacies: filteredPlaces.filter((p) => getType(p) === "pharmacy"),
      police: filteredPlaces.filter((p) => getType(p) === "police_station"),
    };

    return {
      food: base.food.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.food.toLowerCase())
      ),
      stay: base.stay.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.stay.toLowerCase())
      ),
      fuel: base.fuel.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.fuel.toLowerCase())
      ),
      transport: base.transport.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.transport.toLowerCase())
      ),
      rentals: base.rentals.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.rentals.toLowerCase())
      ),
      repairs: base.repairs.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.repairs.toLowerCase())
      ),
      hospitals: base.hospitals.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.hospitals.toLowerCase())
      ),
      pharmacies: base.pharmacies.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.pharmacies.toLowerCase())
      ),
      police: base.police.filter((p) =>
        String(p.name || "").toLowerCase().includes(categorySearch.police.toLowerCase())
      ),
    };
  }, [filteredPlaces, categorySearch]);

  const totalResults =
    groupedPlaces.food.length +
    groupedPlaces.stay.length +
    groupedPlaces.fuel.length +
    groupedPlaces.transport.length +
    groupedPlaces.rentals.length +
    groupedPlaces.repairs.length +
    groupedPlaces.hospitals.length +
    groupedPlaces.pharmacies.length +
    groupedPlaces.police.length;

  const handleDistrictSelect = (districtSlug, categoryKey) => {
    navigate(`/district/${districtSlug}?category=${categoryKey}`);
  };

  const handleCategorySearchChange = (categoryKey, value) => {
    setCategorySearch((prev) => ({
      ...prev,
      [categoryKey]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[420px] sm:min-h-[380px] flex items-center">
          <img
            src="/lagoon.jpeg"
            alt="Explore Sri Lanka"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/kandy.jpg";
            }}
          />
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          <div className="relative z-10 w-full flex flex-col justify-center p-6 sm:p-10 text-white">
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Explore
              </h1>
            </div>

            <p className="mt-3 text-base sm:text-lg text-white/90 max-w-md sm:max-w-2xl leading-relaxed">
              Discover food, stay, transport, fuel, rentals, repairs, and essential services across Sri Lanka.
            </p>

            <div className="mt-5 w-full max-w-2xl relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all categories, places, districts..."
                className="w-full px-5 py-3.5 pl-12 rounded-xl outline-none text-gray-900 bg-white placeholder-gray-500 text-base sm:text-lg border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 shadow-lg transition-all"
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

            <div className="flex gap-2 sm:gap-3 mt-4 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "food", label: "Food" },
                { key: "stay", label: "Stay" },
                { key: "fuel", label: "Fuel" },
                { key: "transport", label: "Transport" },
                { key: "rentals", label: "Rentals" },
                { key: "repairs", label: "Repairs" },
                { key: "services", label: "Services" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveCategory(item.key)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-semibold border transition cursor-pointer ${
                    activeCategory === item.key
                      ? "bg-white text-black border-white"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div>
          <h2 className="text-2xl font-bold">Browse Travel Essentials</h2>
          <p className="text-gray-600 mt-1">
            Find practical places for your trip across Sri Lanka.
          </p>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-gray-600">Loading places...</p>
            </div>
          )}

          {!loading && totalResults === 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <p className="text-gray-600">
                No places found. Try another search or category.
              </p>
            </div>
          )}

          {!loading && totalResults > 0 && (
            <>
              <CategoryRow
                title="Food & Restaurants"
                icon="🍔"
                places={groupedPlaces.food}
                categoryKey="food"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.food}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Stay"
                icon="🏨"
                places={groupedPlaces.stay}
                categoryKey="stay"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.stay}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Fuel Stations"
                icon="⛽"
                places={groupedPlaces.fuel}
                categoryKey="fuel"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.fuel}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Transport"
                icon="🚍"
                places={groupedPlaces.transport}
                categoryKey="transport"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.transport}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Rentals"
                icon="🚗"
                places={groupedPlaces.rentals}
                categoryKey="rentals"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.rentals}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Repairs"
                icon="🔧"
                places={groupedPlaces.repairs}
                categoryKey="repairs"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.repairs}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Hospitals"
                icon="🏥"
                places={groupedPlaces.hospitals}
                categoryKey="hospitals"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.hospitals}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Pharmacies"
                icon="💊"
                places={groupedPlaces.pharmacies}
                categoryKey="pharmacies"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.pharmacies}
                onSearchChange={handleCategorySearchChange}
              />

              <CategoryRow
                title="Police Stations"
                icon="👮"
                places={groupedPlaces.police}
                categoryKey="police"
                onDistrictSelect={handleDistrictSelect}
                searchValue={categorySearch.police}
                onSearchChange={handleCategorySearchChange}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}