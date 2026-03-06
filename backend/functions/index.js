const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

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

// test route
app.get("/hello", (req, res) => {
  res.json({ message: "Backend working!" });
});

// nearby tourism places
app.get("/nearby/places", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng required" });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    const snapshot = await db.collection("places").get();

    const allPlaces = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const nearby = allPlaces
      .filter(
        (p) =>
          typeof p.lat === "number" &&
          typeof p.lng === "number" &&
          p.category === "tourism"
      )
      .map((p) => ({
        ...p,
        distanceKm: distanceKm(userLat, userLng, p.lat, p.lng),
      }))
      .filter((p) => p.distanceKm <= 10)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 9);

    res.json({ results: nearby });
  } catch (error) {
    console.error("Nearby places error:", error);
    res.status(500).json({ error: "Failed to load nearby places" });
  }
});

exports.api = functions.https.onRequest(app);