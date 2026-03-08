// src/pages/home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useUserLocation } from "../hooks/useUserLocation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// District placeholder images (from /public)
const colomboImg = "/kandy.jpg";
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

function getNearbyPlaceImage(place) {
  return place.imageUrl || null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { coords, error: locError } = useUserLocation();

  const [nearbyHomePlaces, setNearbyHomePlaces] = useState([]);
  const [loadingNearbyHome, setLoadingNearbyHome] = useState(false);

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
          "petrol_shed",
          "fuel",
          "car_rental",
          "bike_rental",
          "car_repair",
          "bike_repair",
          "mechanic",
        ];

        const results = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.lat != null && p.lng != null)
          .map((p) => ({
            ...p,
            lat: Number(p.lat),
            lng: Number(p.lng),
            distanceKm: distanceKm(
              coords.lat,
              coords.lng,
              Number(p.lat),
              Number(p.lng)
            ),
          }))
          .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng))
          .filter((p) => p.distanceKm <= 10)
          .filter((p) => {
            const type = String(p.placeType || p.category || "")
              .toLowerCase()
              .trim();
            return allowedTypes.includes(type);
          })
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 12);

        setNearbyHomePlaces(results);
      } catch (error) {
        console.error("Failed to load nearby places:", error);
        setNearbyHomePlaces([]);
      } finally {
        setLoadingNearbyHome(false);
      }
    };

    loadNearbyPlaces();
  }, [coords]);

  const openDirections = (place) => {
    if (!coords || !place || !place.lat || !place.lng) return;

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
              Explore Tourism
            </button>

            <button
              onClick={() => navigate("/tripplan")}
              className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-semibold border border-white hover:bg-gray-800 transition"
            >
              Trip Plan
            </button>
          </div>
        </div>
      </header>

      {coords && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold">Nearby Around You</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Tourist spots, food, transport, fuel, rentals, and repair places within 10 km.
            </p>

            {loadingNearbyHome && (
              <p className="text-gray-600 mt-3">Loading nearby suggestions...</p>
            )}

            {!loadingNearbyHome && nearbyHomePlaces.length === 0 && (
              <p className="text-gray-600 mt-3">No nearby places found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {nearbyHomePlaces.map((p, i) => (
                <button
                  key={p.id || i}
                  onClick={() => openDirections(p)}
                  className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden text-left shadow-sm hover:shadow-lg transition"
                >
                  <img
                    src={getNearbyPlaceImage(p) || "/kandy.jpg"}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.src = "/kandy.jpg";
                    }}
                    className="w-full h-[180px] object-cover"
                  />

                  <div className="p-4">
                    <div className="font-bold text-lg">{p.name}</div>

                    <div className="text-sm text-gray-600 mt-1">
                      {(p.placeType || p.category || "").replaceAll("_", " ")}
                    </div>

                    {typeof p.distanceKm === "number" && (
                      <div className="text-sm text-gray-600 mt-2">
                        ~ {p.distanceKm.toFixed(1)} km away
                      </div>
                    )}

                    <div className="mt-3 inline-block text-sm font-semibold text-blue-600">
                      Open Route
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {locError && <p className="text-red-600 mt-4">{locError}</p>}
          </div>
        </section>
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
          © {new Date().getFullYear()} Perfect Guide. Discover the best places, food, and
          experiences across Sri Lanka. Plan smarter trips with local insights.
        </p>
      </footer>
    </div>
  );
}