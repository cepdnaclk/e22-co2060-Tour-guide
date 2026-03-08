const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const CATEGORY_CONFIG = [
  {
    key: "touristSpots",
    label: "Tourist Spots",
    query: `
      nwr["tourism"="attraction"](around:RADIUS,LAT,LNG);
      nwr["historic"](around:RADIUS,LAT,LNG);
      nwr["tourism"="museum"](around:RADIUS,LAT,LNG);
      nwr["tourism"="viewpoint"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "restInns",
    label: "Rest Inns",
    query: `
      nwr["tourism"="hotel"](around:RADIUS,LAT,LNG);
      nwr["tourism"="guest_house"](around:RADIUS,LAT,LNG);
      nwr["tourism"="motel"](around:RADIUS,LAT,LNG);
      nwr["tourism"="hostel"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "foodPlaces",
    label: "Food Places",
    query: `
      nwr["amenity"="restaurant"](around:RADIUS,LAT,LNG);
      nwr["amenity"="cafe"](around:RADIUS,LAT,LNG);
      nwr["amenity"="fast_food"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "busStations",
    label: "Bus Stands",
    query: `
      nwr["amenity"="bus_station"](around:RADIUS,LAT,LNG);
      nwr["highway"="bus_stop"](around:RADIUS,LAT,LNG);
      nwr["public_transport"="platform"]["bus"="yes"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "petrolSheds",
    label: "Petrol Sheds",
    query: `
      nwr["amenity"="fuel"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "carRentals",
    label: "Car Rentals",
    query: `
      nwr["amenity"="car_rental"](around:RADIUS,LAT,LNG);
      nwr["office"="car_rental"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "bikeRentals",
    label: "Bike Rentals",
    query: `
      nwr["amenity"="bicycle_rental"](around:RADIUS,LAT,LNG);
      nwr["service:bicycle:rental"="yes"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "carMechanics",
    label: "Car Mechanics",
    query: `
      nwr["shop"="car_repair"](around:RADIUS,LAT,LNG);
      nwr["craft"="mechanic"](around:RADIUS,LAT,LNG);
    `,
  },
  {
    key: "bikeMechanics",
    label: "Bike Mechanics",
    query: `
      nwr["shop"="bicycle"](around:RADIUS,LAT,LNG);
      nwr["service:bicycle:repair"="yes"](around:RADIUS,LAT,LNG);
      nwr["shop"="motorcycle_repair"](around:RADIUS,LAT,LNG);
    `,
  },
];

function distanceKm(aLat, aLng, bLat, bLng) {
  const toRad = function (x) {
    return (x * Math.PI) / 180;
  };

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

function buildOverpassQuery(lat, lng, radius, rawQuery) {
  const body = rawQuery
    .replace(/LAT/g, String(lat))
    .replace(/LNG/g, String(lng))
    .replace(/RADIUS/g, String(radius));

  return (
    "[out:json][timeout:25];\n(\n" +
    body +
    "\n);\nout center tags;"
  );
}

function normalizeElement(element, userLat, userLng) {
  const lat =
    element.lat !== undefined
      ? element.lat
      : element.center && element.center.lat !== undefined
      ? element.center.lat
      : null;

  const lng =
    element.lon !== undefined
      ? element.lon
      : element.center && element.center.lon !== undefined
      ? element.center.lon
      : null;

  const name =
    (element.tags && element.tags.name) ||
    (element.tags && element.tags.official_name) ||
    (element.tags && element.tags.brand) ||
    "Unnamed Place";

  const addressParts = [
    element.tags && element.tags["addr:housenumber"],
    element.tags && element.tags["addr:street"],
    element.tags && element.tags["addr:city"],
    element.tags && element.tags["addr:district"],
    element.tags && element.tags["addr:province"],
  ].filter(Boolean);

  return {
    id: String(element.type) + "-" + String(element.id),
    name: name,
    lat: lat,
    lng: lng,
    address: addressParts.join(", "),
    type: element.tags || {},
    osmType: element.type,
    osmId: element.id,
    mapUrl:
      lat && lng
        ? "https://www.openstreetmap.org/?mlat=" +
          lat +
          "&mlon=" +
          lng +
          "#map=16/" +
          lat +
          "/" +
          lng
        : null,
    distanceKm:
      lat && lng
        ? Number(distanceKm(userLat, userLng, lat, lng).toFixed(2))
        : null,
  };
}

async function searchOverpass(lat, lng, radius, rawQuery) {
  const query = buildOverpassQuery(lat, lng, radius, rawQuery);

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Overpass request failed: " + response.status + " " + text);
  }

  const data = await response.json();
  return data.elements || [];
}

app.get("/hello", function (req, res) {
  res.json({ message: "Backend working!" });
});

app.get("/nearby/home-suggestions", async function (req, res) {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng required" });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    const snapshot = await db.collection("places").get();

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
      .map(function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
      })
      .filter(function (p) {
        return p.lat != null && p.lng != null;
      })
      .map(function (p) {
        return Object.assign({}, p, {
          lat: Number(p.lat),
          lng: Number(p.lng),
          distanceKm: distanceKm(
            userLat,
            userLng,
            Number(p.lat),
            Number(p.lng)
          ),
        });
      })
      .filter(function (p) {
        return !Number.isNaN(p.lat) && !Number.isNaN(p.lng);
      })
      .filter(function (p) {
        return p.distanceKm <= 10;
      })
      .filter(function (p) {
        const type = String(p.placeType || p.category || "")
          .toLowerCase()
          .trim();
        return allowedTypes.includes(type);
      })
      .sort(function (a, b) {
        return a.distanceKm - b.distanceKm;
      })
      .slice(0, 12);

    res.json({ results: results });
  } catch (error) {
    console.error("home suggestions error:", error);
    res.status(500).json({ error: "Failed to load home suggestions" });
  }
});

exports.api = functions.https.onRequest(app);