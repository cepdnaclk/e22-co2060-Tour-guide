const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

// Example test API
app.get("/hello", (req, res) => {
  res.json({ message: "Backend working!" });
});

// Example nearby places API
app.get("/nearby/places", async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }

  res.json({
    results: [
      {
        name: "Sigiriya Rock Fortress",
        rating: 4.7,
        vicinity: "Matale District",
      },
      {
        name: "Pidurangala Rock",
        rating: 4.6,
        vicinity: "Near Sigiriya",
      },
    ],
  });
});

exports.api = functions.https.onRequest(app);