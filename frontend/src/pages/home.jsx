import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useUserLocation } from "../hooks/useUserLocation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Map } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// District placeholder images (from /public)
const colomboImg = "/Colombo.jpg";
const gampahaImg = "/kandy.jpg";
const kalutaraImg = "/kandy.jpg";
const kandyImg = "/kandy.jpg";
const mataleImg = "/kandy.jpg";
const nuwaraEliyaImg = "/kandy.jpg";
const galleImg = "/galle.jpg";
const mataraImg = "/kandy.jpg";
const hambantotaImg = "/kandy.jpg";
const jaffnaImg = "/kandy.jpg";
const kilinochchiImg = "/kandy.jpg";
const mannarImg = "/kandy.jpg";
const mullaitivuImg = "/kandy.jpg";
const vavuniyaImg = "/kandy.jpg";
const trincoImg = "/kandy.jpg";
const batticaloaImg = "/kandy.jpg";
const amparaImg = "/kandy.jpg";
const puttalamImg = "/kandy.jpg";
const kurunegalaImg = "/kandy.jpg";
const anuradhapuraImg = "/kandy.jpg";
const polonnaruwaImg = "/kandy.jpg";
const badullaImg = "/kandy.jpg";
const monaragalaImg = "/kandy.jpg";
const ratnapuraImg = "/kandy.jpg";
const kegalleImg = "/kandy.jpg";

const districts = [
  { name: "Colombo", slug: "colombo", image: colomboImg },
  { name: "Gampaha", slug: "gampaha", image: gampahaImg },
  { name: "Kalutara", slug: "kalutara", image: kalutaraImg },
  { name: "Kandy", slug: "kandy", image: kandyImg },
  { name: "Matale", slug: "matale", image: mataleImg },
  { name: "Nuwara Eliya", slug: "nuwara-eliya", image: nuwaraEliyaImg },
  { name: "Galle", slug: "galle", image: galleImg },
  { name: "Matara", slug: "matara", image: mataraImg },
  { name: "Hambantota", slug: "hambantota", image: hambantotaImg },
  { name: "Jaffna", slug: "jaffna", image: jaffnaImg },
  { name: "Kilinochchi", slug: "kilinochchi", image: kilinochchiImg },
  { name: "Mannar", slug: "mannar", image: mannarImg },
  { name: "Mullaitivu", slug: "mullaitivu", image: mullaitivuImg },
  { name: "Vavuniya", slug: "vavuniya", image: vavuniyaImg },
  { name: "Trincomalee", slug: "trincomalee", image: trincoImg },
  { name: "Batticaloa", slug: "batticaloa", image: batticaloaImg },
  { name: "Ampara", slug: "ampara", image: amparaImg },
  { name: "Puttalam", slug: "puttalam", image: puttalamImg },
  { name: "Kurunegala", slug: "kurunegala", image: kurunegalaImg },
  { name: "Anuradhapura", slug: "anuradhapura", image: anuradhapuraImg },
  { name: "Polonnaruwa", slug: "polonnaruwa", image: polonnaruwaImg },
  { name: "Badulla", slug: "badulla", image: badullaImg },
  { name: "Monaragala", slug: "monaragala", image: monaragalaImg },
  { name: "Ratnapura", slug: "ratnapura", image: ratnapuraImg },
  { name: "Kegalle", slug: "kegalle", image: kegalleImg },
];

function distanceKm(aLat, aLng, bLat, bLng) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const s1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
  return R * c;
}

function parseCoordinate(value) {
  if (value == null) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Firestore GeoPoint-like support
  if (typeof value === "object") {
    if (typeof value.latitude === "number") return value.latitude;
    if (typeof value.longitude === "number") return value.longitude;
    if (typeof value._lat === "number") return value._lat;
    if (typeof value._long === "number") return value._long;
  }

  return null;
}

function getNearbyPlaceImage(place) {
  return place.imageUrl || null;
}

function PlaceCard({ place, onOpenRoute }) {
  return (
    <div className="min-w-[240px] max-w-[240px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
      <img
        src={getNearbyPlaceImage(place) || "/kandy.jpg"}
        alt={place.name}
        onError={(e) => {
          e.currentTarget.src = "/kandy.jpg";
        }}
        className="w-full h-[150px] object-cover"
      />

      <div className="p-4 relative min-h-[130px]">
        <h3 className="font-bold text-base line-clamp-1">{place.name}</h3>

        <p className="text-sm text-gray-600 mt-1 capitalize">
          {(place.placeType || place.placetype || place.category || "place").replaceAll("_", " ")}
        </p>

        {typeof place.distanceKm === "number" && (
          <p className="text-sm text-gray-500 mt-1">
            ~ {place.distanceKm.toFixed(1)} km away
          </p>
        )}

        <button
          onClick={() => onOpenRoute(place)}
          title="View on map"
          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
        >
          <Map size={20} />
        </button>
      </div>
    </div>
  );
}

function CategoryRow({ title, icon, places, onOpenRoute }) {
  if (!places || places.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {places.map((place, index) => (
          <PlaceCard
            key={place.id || `${title}-${index}`}
            place={place}
            onOpenRoute={onOpenRoute}
          />
        ))}
      </div>
    </div>
  );
}

function NearbySuggestionsPopup({
  groupedPlaces,
  onClose,
  onOpenRoute,
  loading,
  locError,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              📍 Nearby Suggestions
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Tourism, food, transport, fuel, rentals and repairs within 10 km.
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-4 text-2xl leading-none text-gray-600 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {loading && (
            <p className="text-gray-600">Loading nearby suggestions...</p>
          )}

          {locError && <p className="text-red-600">{locError}</p>}

          {!loading &&
            !locError &&
            Object.values(groupedPlaces).every((arr) => arr.length === 0) && (
              <p className="text-gray-600">No nearby places found.</p>
            )}

          <CategoryRow
            title="Tourism"
            icon="🏞"
            places={groupedPlaces.tourism}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Food & Restaurants"
            icon="🍔"
            places={groupedPlaces.food}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Stay"
            icon="🏨"
            places={groupedPlaces.stay}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Fuel Stations"
            icon="⛽"
            places={groupedPlaces.fuel}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Transport"
            icon="🚍"
            places={groupedPlaces.transport}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Repair & Rentals"
            icon="🔧"
            places={groupedPlaces.repairsAndRentals}
            onOpenRoute={onOpenRoute}
          />

          <CategoryRow
            title="Emergency & Services"
            icon="🏥"
            places={groupedPlaces.emergencyServices}
            onOpenRoute={onOpenRoute}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { coords, error: locError } = useUserLocation();

  const [nearbyHomePlaces, setNearbyHomePlaces] = useState([]);
  const [loadingNearbyHome, setLoadingNearbyHome] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const heroImages = ["/beach.jpg", "/lagoon.jpeg", "/sunset.jpeg"];
  const [heroIndex, setHeroIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (!coords) return;

    console.log("Current user coords:", coords);

    const loadNearbyPlaces = async () => {
      try {
        setLoadingNearbyHome(true);

        const snapshot = await getDocs(collection(db, "places"));

        const allowedTypes = [
          "tourism",
          "heritage",
          "attraction",
          "museum",
          "viewpoint",
          "food",
          "restaurant",
          "cafe",
          "fast_food",
          "stay",
          "hotel",
          "guest_house",
          "hostel",
          "bus_stand",
          "railway_station",
          "petrol_shed",
          "fuel",
          "car_rental",
          "bike_rental",
          "car_repair",
          "bike_repair",
          "mechanic",
          "pharmacy",
          "police_station",
          "hospital",
        ];

        const results = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .map((p) => {
            const lat = parseCoordinate(p.lat);
            const lng = parseCoordinate(p.lng);

            return {
              ...p,
              lat,
              lng,
            };
          })
          .filter((p) => p.lat != null && p.lng != null)
          .map((p) => ({
            ...p,
            distanceKm: distanceKm(coords.lat, coords.lng, p.lat, p.lng),
          }))
          .filter((p) => !Number.isNaN(p.distanceKm))
          .filter((p) => {
            const type = String(
              p.placeType || p.placetype || p.category || ""
            )
              .toLowerCase()
              .trim();
            return allowedTypes.includes(type);
          })
          .filter((p) => p.distanceKm <= 10)
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 30);

        console.log("Nearby results:", results);

        setNearbyHomePlaces(results);

        const popupAlreadyShown = sessionStorage.getItem("nearbySuggestionsShown");

        if (results.length > 0 && !popupAlreadyShown) {
          setShowPopup(true);
          sessionStorage.setItem("nearbySuggestionsShown", "true");
        }
      } catch (error) {
        console.error("Failed to load nearby places:", error);
        setNearbyHomePlaces([]);
      } finally {
        setLoadingNearbyHome(false);
      }
    };

    loadNearbyPlaces();
  }, [coords]);

  const groupedPlaces = useMemo(() => {
    const getType = (p) =>
      String(p.placeType || p.placetype || p.category || "")
        .toLowerCase()
        .trim();

    return {
      tourism: nearbyHomePlaces.filter((p) =>
        ["tourism", "heritage", "attraction", "museum", "viewpoint"].includes(
          getType(p)
        )
      ),
      food: nearbyHomePlaces.filter((p) =>
        ["food", "restaurant", "cafe", "fast_food"].includes(getType(p))
      ),
      stay: nearbyHomePlaces.filter((p) =>
        ["stay", "hotel", "guest_house", "hostel"].includes(getType(p))
      ),
      fuel: nearbyHomePlaces.filter((p) =>
        ["petrol_shed", "fuel"].includes(getType(p))
      ),
      transport: nearbyHomePlaces.filter((p) =>
        ["bus_stand", "railway_station"].includes(getType(p))
      ),
      repairsAndRentals: nearbyHomePlaces.filter((p) =>
        [
          "car_rental",
          "bike_rental",
          "car_repair",
          "bike_repair",
          "mechanic",
        ].includes(getType(p))
      ),
      emergencyServices: nearbyHomePlaces.filter((p) =>
        ["pharmacy", "police_station", "hospital"].includes(getType(p))
      ),
    };
  }, [nearbyHomePlaces]);

  const openDirections = (place) => {
    if (!coords || !place || place.lat == null || place.lng == null) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${place.lat},${place.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="home">
      <header className="relative max-w-6xl mx-auto mt-4 sm:mt-8 px-4 sm:px-0 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={heroImages[heroIndex]}
          alt="Trip Banner"
          className={`w-full h-[520px] sm:h-[460px] md:h-[420px] object-cover transition-opacity duration-700 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold leading-tight drop-shadow-lg max-w-[320px] sm:max-w-none">
            Your Trip Starts Here
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-6 text-base sm:text-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="bg-green-500 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                ✓
              </span>
              <span>Secure payment</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="bg-green-500 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                ✓
              </span>
              <span>Support in approx. 30s</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4 mt-8 max-w-[280px] sm:max-w-none">
            <button
              onClick={() => navigate("/tourism")}
              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Tourism
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Explore
            </button>

            {currentUser && (
              <button
                onClick={() => navigate("/tripplan")}
                className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-semibold border border-white hover:bg-gray-800 transition"
              >
                Trip Plan
              </button>
            )}

            <button
              onClick={() => setShowPopup(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Nearby Suggestions
            </button>
          </div>
        </div>
      </header>

      {!coords && !locError && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-gray-100">
            <p className="text-gray-600">Waiting for your location...</p>
          </div>
        </section>
      )}

      {locError && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-gray-100">
            <p className="text-red-600">{locError}</p>
          </div>
        </section>
      )}

      {showPopup && (
        <NearbySuggestionsPopup
          groupedPlaces={groupedPlaces}
          onClose={() => setShowPopup(false)}
          onOpenRoute={openDirections}
          loading={loadingNearbyHome}
          locError={locError}
        />
      )}

      <section className="districtSection px-4 sm:px-6 md:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {districts.map((d) => (
            <button
              key={d.slug}
              className="districtCard"
              onClick={() => navigate(`/district/${d.slug}`)}
              title={`Open ${d.name}`}
            >
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-[200px] sm:h-[240px] md:h-[260px] object-cover rounded-t-2xl"
              />
              <div className="districtLabel px-3 py-4 sm:px-4">
                <span className="text-lg sm:text-xl font-bold">{d.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer px-4">
        <p>
          © {new Date().getFullYear()} Perfect Guide. Discover the best places,
          food, and experiences across Sri Lanka. Plan smarter trips with local
          insights.
        </p>
      </footer>
    </div>
  );
}