import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PlacesMap from "../components/PlacesMap";
import PageNavigation from "../components/PageNavigation";
import { Map } from "lucide-react";


function formatDistrictName(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const districtImages = {
  colombo: "/Colombo.jpg",
  kandy: "/kandy.jpg",
  galle: "/galle.jpg",
  "nuwara-eliya": "/kandy.jpg",
  jaffna: "/kandy.jpg",
  default: "/kandy.jpg",
};

function getDistrictImage(slug) {
  return districtImages[slug] || districtImages.default;
}

function getDistrictIntro(slug) {
  const intros = {
    kandy:
      "Explore cultural landmarks, scenic viewpoints, local food, transport, fuel, services, and essential places across Kandy.",
    colombo:
      "Discover urban attractions, food, transport hubs, city services, and travel spots across Colombo.",
    galle:
      "Explore heritage, coastal attractions, food, and local experiences across Galle.",
  };

  return (
    intros[slug] ||
    `Explore tourism, food, stay, transport, and services across ${formatDistrictName(
      slug
    )}.`
  );
}

function getPlaceImage(place) {
  return place.imageUrl || "/kandy.jpg";
}

function PlaceCard({ place }) {
  const openDirections = () => {
    if (!place?.lat || !place?.lng) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-w-[240px] max-w-[240px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
      <img
        src={getPlaceImage(place)}
        alt={place.name}
        onError={(e) => {
          e.currentTarget.src = "/kandy.jpg";
        }}
        className="w-full h-[150px] object-cover"
      />

      <div className="p-4 relative min-h-[110px]">
        <h3 className="font-bold text-base line-clamp-1">{place.name}</h3>

        <p className="text-sm text-gray-600 mt-1 capitalize">
          {(place.placeType || place.placetype || place.category || "place").replaceAll("_", " ")}
        </p>

        <button
  onClick={openDirections}
  title="View on map"
  className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
>
  <Map size={20} />
</button>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  icon,
  places,
  mapTitle,
  showMap,
  onToggleMap,
}) {
  if (!places || places.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold">
            {title} <span className="text-gray-500 text-lg">({places.length})</span>
          </h2>
        </div>

        <button
          onClick={onToggleMap}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold transition"
        >
          {showMap ? "Hide Map" : `Show ${title} Map`}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {places.map((place, index) => (
          <PlaceCard key={place.id || index} place={place} />
        ))}
      </div>

      {showMap && <PlacesMap title={mapTitle} places={places} height="420px" />}
    </section>
  );
}

export default function DistrictPage() {
  const { slug } = useParams();
  const districtName = formatDistrictName(slug);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [openMaps, setOpenMaps] = useState({
    tourism: false,
    food: false,
    stay: false,
    fuel: false,
    transport: false,
    repairs: false,
    emergency: false,
  });

  const tourismRef = useRef(null);
  const foodRef = useRef(null);
  const stayRef = useRef(null);
  const fuelRef = useRef(null);
  const transportRef = useRef(null);
  const repairRef = useRef(null);
  const emergencyRef = useRef(null);
  const districtMapRef = useRef(null);

  useEffect(() => {
    const loadDistrictPlaces = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "places"));

        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => {
            const district = String(p.district || p.districtName || "")
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-");

            return district === slug;
          });

        setPlaces(data);
      } catch (error) {
        console.error("Failed to load district places:", error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadDistrictPlaces();
    }
  }, [slug]);


  useEffect(() => {
  if (loading || !selectedCategory) return;

  const categoryRefMap = {
    tourism: tourismRef,
    food: foodRef,
    stay: stayRef,
    fuel: fuelRef,
    transport: transportRef,
    repairs: repairRef,
    emergency: emergencyRef,
  };

  const targetRef = categoryRefMap[selectedCategory];

  if (targetRef?.current) {
    setTimeout(() => {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }
}, [loading, selectedCategory]);



  const groupedPlaces = useMemo(() => {
    const getType = (p) =>
      String(p.placeType || p.placetype || p.category || "")
        .toLowerCase()
        .trim();

    return {
      tourism: places.filter((p) =>
        ["tourism", "heritage", "attraction", "museum", "viewpoint"].includes(
          getType(p)
        )
      ),
      food: places.filter((p) =>
        ["food", "restaurant", "cafe", "fast_food"].includes(getType(p))
      ),
      stay: places.filter((p) =>
        ["stay", "hotel", "guest_house", "hostel"].includes(getType(p))
      ),
      fuel: places.filter((p) =>
        ["petrol_shed", "fuel"].includes(getType(p))
      ),
      transport: places.filter((p) =>
        ["bus_stand", "railway_station"].includes(getType(p))
      ),
      repairsAndRentals: places.filter((p) =>
        [
          "car_rental",
          "bike_rental",
          "car_repair",
          "bike_repair",
          "mechanic",
        ].includes(getType(p))
      ),
      emergencyServices: places.filter((p) =>
        ["hospital", "pharmacy", "police_station"].includes(getType(p))
      ),
    };
  }, [places]);

  const hasAnyPlaces = places.length > 0;

  const chips = [
    { label: "District Map", ref: districtMapRef },
    { label: "Tourism", ref: tourismRef },
    { label: "Food", ref: foodRef },
    { label: "Stay", ref: stayRef },
    { label: "Fuel", ref: fuelRef },
    { label: "Transport", ref: transportRef },
    { label: "Repairs", ref: repairRef },
    { label: "Services", ref: emergencyRef },
  ];

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMap = (key) => {
    setOpenMaps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src={getDistrictImage(slug)}
            alt={districtName}
            className="w-full h-[260px] sm:h-[320px] object-cover"
            onError={(e) => {
              e.currentTarget.src = "/kandy.jpg";
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              {districtName}
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg max-w-2xl text-white/90">
              {getDistrictIntro(slug)}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
         
          <PageNavigation className="mb-6" />

        
        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap gap-3">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => scrollToRef(chip.ref)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-600">Loading {districtName} places...</p>
          </div>
        )}

        {!loading && !hasAnyPlaces && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to {districtName}
              </h2>
              <p className="text-gray-600">
                We are still adding tourism spots, food places, transport
                points, rentals, repairs, and services for this district.
              </p>
            </div>
          </div>
        )}

        {!loading && hasAnyPlaces && (
          <>
            <div ref={districtMapRef}>
              <PlacesMap
                title={`${districtName} District Map`}
                places={places}
                height="500px"
              />
            </div>

            <div ref={tourismRef}>
              <CategorySection
                title="Tourism"
                icon="🏞️"
                places={groupedPlaces.tourism}
                mapTitle="Tourism Map"
                showMap={openMaps.tourism}
                onToggleMap={() => toggleMap("tourism")}
              />
            </div>

            <div ref={foodRef}>
              <CategorySection
                title="Food & Restaurants"
                icon="🍔"
                places={groupedPlaces.food}
                mapTitle="Food & Restaurants Map"
                showMap={openMaps.food}
                onToggleMap={() => toggleMap("food")}
              />
            </div>

            <div ref={stayRef}>
              <CategorySection
                title="Stay"
                icon="🏨"
                places={groupedPlaces.stay}
                mapTitle="Stay Map"
                showMap={openMaps.stay}
                onToggleMap={() => toggleMap("stay")}
              />
            </div>

            <div ref={fuelRef}>
              <CategorySection
                title="Fuel Stations"
                icon="⛽"
                places={groupedPlaces.fuel}
                mapTitle="Fuel Stations Map"
                showMap={openMaps.fuel}
                onToggleMap={() => toggleMap("fuel")}
              />
            </div>

            <div ref={transportRef}>
              <CategorySection
                title="Transport"
                icon="🚍"
                places={groupedPlaces.transport}
                mapTitle="Transport Map"
                showMap={openMaps.transport}
                onToggleMap={() => toggleMap("transport")}
              />
            </div>

            <div ref={repairRef}>
              <CategorySection
                title="Repair & Rentals"
                icon="🔧"
                places={groupedPlaces.repairsAndRentals}
                mapTitle="Repair & Rentals Map"
                showMap={openMaps.repairs}
                onToggleMap={() => toggleMap("repairs")}
              />
            </div>

            <div ref={emergencyRef}>
              <CategorySection
                title="Emergency & Services"
                icon="🏥"
                places={groupedPlaces.emergencyServices}
                mapTitle="Emergency & Services Map"
                showMap={openMaps.emergency}
                onToggleMap={() => toggleMap("emergency")}
              />
            </div>
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 pt-4">
        <div className="bg-white rounded-2xl shadow px-6 py-5 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Welcome to {districtName}
          </p>
          <p className="text-gray-600 mt-1">
            Discover places, food, transport, services, and local experiences
            across {districtName}.
          </p>
        </div>
      </footer>
    </div>
  );
}