const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importPlaces() {

  const url =
    "https://overpass-api.de/api/interpreter?data=[out:json];node['tourism'](5.9,79.5,10.1,82.0);out;";

  const res = await fetch(url);
  const data = await res.json();

  for (const place of data.elements) {

    const name = place.tags?.name;

    if (!name) continue;

    await db.collection("places").add({
      name: name,
      category: place.tags.tourism,
      lat: place.lat,
      lng: place.lon
    });

    console.log("Saved:", name);
  }

  console.log("Import completed");
}

importPlaces();