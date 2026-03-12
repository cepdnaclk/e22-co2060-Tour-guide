const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const places = require("./firebase_places.json");

console.log("Project ID from key:", serviceAccount.project_id);

async function upload() {
  for (const p of places) {
    const ref = await db.collection("places").add(p);
    console.log("Uploaded:", p.name, "Doc ID:", ref.id);
  }

  console.log("Upload complete");
}

upload().catch((err) => {
  console.error("Upload failed:", err);
});