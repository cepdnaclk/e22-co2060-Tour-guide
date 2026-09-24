import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { SRI_LANKA_ATTRACTIONS } from "./sriLankaAttractionsData.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbmc5pTX3wxch7jQEXpPVjlGlz2WFpVYE",
  authDomain: "trip-advisor-e5679.firebaseapp.com",
  projectId: "trip-advisor-e5679",
  storageBucket: "trip-advisor-e5679.firebasestorage.app",
  messagingSenderId: "900654202225",
  appId: "1:900654202225:web:46cb15d69f41362dc54ad0",
  measurementId: "G-8FLFKRZSWT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedFirestore() {
  console.log(`🚀 Starting Firestore Seeding for project: ${firebaseConfig.projectId}...`);

  try {
    const userCred = await signInAnonymously(auth);
    console.log(`🔑 Authenticated anonymously as: ${userCred.user.uid}`);
  } catch (err) {
    console.warn("⚠️ Anonymous auth warning:", err.message);
  }

  console.log(`📦 Uploading ${SRI_LANKA_ATTRACTIONS.length} attractions covering all 25 districts of Sri Lanka...`);

  let successCount = 0;
  let errorCount = 0;

  for (const place of SRI_LANKA_ATTRACTIONS) {
    try {
      const docRef = doc(db, "places", place.id);
      await setDoc(docRef, place, { merge: true });
      console.log(`  ✅ Uploaded: ${place.name} (${place.district})`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed: ${place.name} - ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n============================================");
  console.log(`🎉 Seeding Status:`);
  console.log(`   Success: ${successCount} documents`);
  console.log(`   Failed:  ${errorCount} documents`);
  console.log("============================================\n");
}

seedFirestore().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error("Fatal Seeding Error:", err);
  process.exit(1);
});
