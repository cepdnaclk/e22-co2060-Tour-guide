const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Kandy district-ish working bbox
const district = {
  slug: "kandy",
  name: "Kandy",
  south: 7.20,
  west: 80.55,
  north: 7.38,
  east: 80.72,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function classifyPlace(tags = {}) {
  // tourism
  if (tags.tourism === "museum") return { category: "tourism", placeType: "museum" };
  if (tags.tourism === "viewpoint") return { category: "tourism", placeType: "viewpoint" };
  if (tags.tourism === "zoo") return { category: "tourism", placeType: "zoo" };
  if (tags.tourism === "attraction") return { category: "tourism", placeType: "attraction" };
  if (tags.natural === "waterfall") return { category: "tourism", placeType: "waterfall" };

  // food
  if (tags.amenity === "restaurant") return { category: "food", placeType: "restaurant" };
  if (tags.amenity === "cafe") return { category: "food", placeType: "cafe" };
  if (tags.amenity === "fast_food") return { category: "food", placeType: "fast_food" };

  // stay
  if (tags.tourism === "hotel") return { category: "stay", placeType: "hotel" };
  if (tags.tourism === "guest_house") return { category: "stay", placeType: "guest_house" };
  if (tags.tourism === "hostel") return { category: "stay", placeType: "hostel" };
  if (tags.tourism === "motel") return { category: "stay", placeType: "motel" };

  return { category: "tourism", placeType: "attraction" };
}

async function fetchOverpass(query, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
    });

    if (res.ok) return res.json();

    console.log(`Attempt ${attempt} failed with ${res.status}`);
    if (attempt < retries) {
      await sleep(4000 * attempt);
    } else {
      throw new Error(`Overpass failed: ${res.status}`);
    }
  }
}

async function importKandy() {
  console.log("Importing Kandy tourism + food + stays...");

  const query = `
    [out:json][timeout:60];
    (
      node["tourism"~"attraction|museum|viewpoint|zoo|hotel|guest_house|hostel|motel"](${district.south},${district.west},${district.north},${district.east});
      way["tourism"~"attraction|museum|viewpoint|zoo|hotel|guest_house|hostel|motel"](${district.south},${district.west},${district.north},${district.east});

      node["amenity"~"restaurant|cafe|fast_food"](${district.south},${district.west},${district.north},${district.east});
      way["amenity"~"restaurant|cafe|fast_food"](${district.south},${district.west},${district.north},${district.east});

      node["natural"="waterfall"](${district.south},${district.west},${district.north},${district.east});
      way["natural"="waterfall"](${district.south},${district.west},${district.north},${district.east});
    );
    out center tags;
  `;

  const data = await fetchOverpass(query);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  // create/update district doc
  await db.collection("districts").doc(district.slug).set(
    {
      name: district.name,
      slug: district.slug,
      center: { lat: 7.2906, lng: 80.6337 },
      bbox: {
        south: district.south,
        west: district.west,
        north: district.north,
        east: district.east,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  for (const el of data.elements || []) {
    const name = el.tags?.name;
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;

    if (!name || lat == null || lng == null) {
      skipped++;
      continue;
    }

    const normalizedName = normalizeName(name);
    const sourceId = `${el.type}/${el.id}`;
    const docId = sourceId.replace("/", "_");
    const { category, placeType } = classifyPlace(el.tags);

    // prevent duplicate same-name docs inside kandy
    const existing = await db
      .collection("places")
      .where("district", "==", district.slug)
      .where("normalizedName", "==", normalizedName)
      .limit(1)
      .get();

    if (!existing.empty) {
      const existingDoc = existing.docs[0];
      await existingDoc.ref.set(
        {
          category,
          placeType,
          lat,
          lng,
          tags: el.tags || {},
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      updated++;
      continue;
    }

    await db.collection("places").doc(docId).set(
      {
        name,
        normalizedName,
        district: district.slug,
        districtName: district.name,
        category,
        placeType,
        source: "osm",
        sourceId,
        lat,
        lng,
        tags: el.tags || {},
        isActive: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    inserted++;
  }

  await db.collection("import_jobs").doc(`kandy-${Date.now()}`).set({
    district: district.slug,
    source: "overpass",
    fetched: (data.elements || []).length,
    inserted,
    updated,
    skipped,
    status: "success",
    finishedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Kandy import done. fetched=${(data.elements || []).length}, inserted=${inserted}, updated=${updated}, skipped=${skipped}`);
}

importKandy().catch((err) => {
  console.error(err);
  process.exit(1);
});