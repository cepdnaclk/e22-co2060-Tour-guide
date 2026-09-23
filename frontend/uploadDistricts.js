import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Helper to extract exported object from a JSX file
function extractExportedObject(filePath, exportName) {
  const content = readFileSync(filePath, "utf8");
  const regex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*\\n\\s*(?:function|export|const)`, "m");
  const match = content.match(regex);
  if (!match) {
    const altRegex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\{[\\s\\S]*?\\});\\s*(?:function|export|\\n)`, "m");
    const altMatch = content.match(altRegex);
    if (!altMatch) {
      throw new Error(`Could not parse exported ${exportName} from ${filePath}`);
    }
    return new Function(`return ${altMatch[1]}`)();
  }
  return new Function(`return ${match[1]}`)();
}

console.log("Extracting datasets from JSX files...");
const COLOMBO_CATEGORIZED_PLACES = extractExportedObject("./src/pages/ColomboPage.jsx", "COLOMBO_CATEGORIZED_PLACES");
console.log("✓ Loaded Colombo dataset.");

const GAMPAHA_CATEGORIZED_PLACES = extractExportedObject("./src/pages/GampahaPage.jsx", "GAMPAHA_CATEGORIZED_PLACES");
console.log("✓ Loaded Gampaha dataset.");

const KALUTARA_CATEGORIZED_PLACES = extractExportedObject("./src/pages/KalutaraPage.jsx", "KALUTARA_CATEGORIZED_PLACES");
console.log("✓ Loaded Kalutara dataset.");

// 1. Read Firebase Config from src/firebase.js
let firebaseConfig;
try {
  const firebaseJsContent = readFileSync("./src/firebase.js", "utf8");
  const match = firebaseJsContent.match(/const\s+firebaseConfig\s*=\s*(\{[\s\S]*?\});/);
  if (!match) {
    throw new Error("Could not parse 'const firebaseConfig' block from src/firebase.js");
  }
  firebaseConfig = new Function(`return ${match[1]}`)();
  console.log(`Loaded Firebase Config for Project: ${firebaseConfig.projectId}`);
} catch (error) {
  console.error("Error reading firebaseConfig:", error.message);
  process.exit(1);
}

// 2. Initialize Firebase App, Auth, and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Authenticate using the exact credential from uploadData.js
async function authenticate() {
  const email = "uploader_temp_admin@example.com";
  const password = "TemporaryPassword123!";
  
  try {
    console.log(`Authenticating user: ${email}...`);
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Created new uploader admin account.");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in existing uploader admin account.");
    } else {
      console.warn("Sign-up fallback to sign-in:", error.message);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        console.error("Authentication failed:", e.message);
      }
    }
  }
}

function flattenCategories(categorizedObj) {
  return [
    ...(categorizedObj.tourism || []),
    ...(categorizedObj.food || []),
    ...(categorizedObj.stay || []),
    ...(categorizedObj.fuel || []),
    ...(categorizedObj.transport || []),
    ...(categorizedObj.repairsAndRentals || []),
    ...(categorizedObj.emergencyServices || []),
  ];
}

async function uploadDistrictsData() {
  await authenticate();

  const districtTargets = [
    {
      docId: "colombo",
      name: "Colombo",
      slug: "colombo",
      categorized: COLOMBO_CATEGORIZED_PLACES
    },
    {
      docId: "gampaha",
      name: "Gampaha",
      slug: "gampaha",
      categorized: GAMPAHA_CATEGORIZED_PLACES
    },
    {
      docId: "kalutara",
      name: "Kalutara",
      slug: "kalutara",
      categorized: KALUTARA_CATEGORIZED_PLACES
    }
  ];

  for (const target of districtTargets) {
    console.log(`\n========================================`);
    console.log(`Processing District Document: "${target.docId}"`);
    console.log(`========================================`);

    const allPlaces = flattenCategories(target.categorized);

    const districtDocData = {
      districtName: target.name,
      slug: target.slug,
      totalPlacesCount: allPlaces.length,
      categorizedPlaces: target.categorized,
      tourism: target.categorized.tourism || [],
      food: target.categorized.food || [],
      stay: target.categorized.stay || [],
      fuel: target.categorized.fuel || [],
      transport: target.categorized.transport || [],
      repairsAndRentals: target.categorized.repairsAndRentals || [],
      emergencyServices: target.categorized.emergencyServices || [],
      allPlaces: allPlaces,
      updatedAt: new Date().toISOString()
    };

    // Try uploading to districts/{docId}
    try {
      const districtDocRef = doc(db, "districts", target.docId);
      await setDoc(districtDocRef, districtDocData);
      console.log(`✓ Document created at: districts/${target.docId}`);
    } catch (err) {
      console.error(`--> Could not write to districts/${target.docId}:`, err.message);
    }

    // Try uploading to places/district-{docId} as fallback/duplicate
    try {
      const placesDocRef = doc(db, "places", `district-${target.docId}`);
      await setDoc(placesDocRef, districtDocData);
      console.log(`✓ Document created at: places/district-${target.docId}`);
    } catch (err) {
      console.error(`--> Could not write to places/district-${target.docId}:`, err.message);
    }

    // Upload individual place documents to top-level "places" collection
    console.log(`Uploading ${allPlaces.length} individual places into "places" collection...`);
    let count = 0;
    for (const place of allPlaces) {
      try {
        const placeRef = doc(db, "places", place.id);
        await setDoc(placeRef, { ...place, district: target.name, districtSlug: target.slug });
        count++;
      } catch (err) {
        console.error(`Failed uploading place ${place.id}:`, err.message);
      }
    }
    console.log(`✓ Uploaded ${count}/${allPlaces.length} places into "places" collection.`);
  }

  console.log(`\n========================================`);
  console.log(`🎉 BULK UPLOAD PROCESS COMPLETE!`);
  console.log(`========================================`);
  process.exit(0);
}

uploadDistrictsData().catch((err) => {
  console.error("Fatal error during district upload:", err);
  process.exit(1);
});
