import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// 1. Read the firebaseConfig keys from the project setup (src/firebase.js)
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
  console.error("Error reading firebaseConfig from project setup:", error.message);
  process.exit(1);
}

// 2. Initialize Firebase App, Auth, and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Read beaches.json
let beaches;
try {
  beaches = JSON.parse(readFileSync("./beaches.json", "utf8"));
  console.log(`Loaded ${beaches.length} beach records from beaches.json`);
} catch (error) {
  console.error("Error reading beaches.json:", error.message);
  process.exit(1);
}

// 4. Authenticate script
async function authenticate() {
  const email = "uploader_temp_admin@example.com";
  const password = "TemporaryPassword123!";
  
  try {
    console.log(`Attempting to sign up user: ${email}...`);
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Authentication successful: Created new uploader user.");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log(`User already exists. Logging in user: ${email}...`);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Authentication successful: Signed in existing uploader user.");
    } else {
      console.warn("Authentication sign up failed, attempting sign in directly as fallback:", error.message);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Authentication successful via direct sign in.");
      } catch (signInErr) {
        console.error("Authentication completely failed:", signInErr.message);
        console.log("Proceeding unauthenticated (may fail if rules restrict writes)...");
      }
    }
  }
}

// 5. Upload data loop
async function uploadData() {
  await authenticate();
  
  console.log("Starting bulk upload to Firestore subcollection: Tourism/Beaches/Places");
  
  for (const beach of beaches) {
    try {
      // Create a readable slug for the document ID (e.g. "Mirissa Beach" -> "mirissa")
      const docId = beach.name
        .toLowerCase()
        .replace(/ beach$/i, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      console.log(`Uploading: "${beach.name}" as document "${docId}"...`);
      
      const docRef = doc(db, "Tourism", "Beaches", "Places", docId);
      await setDoc(docRef, beach);
      console.log(`--> Success! Document created at path: Tourism/Beaches/Places/${docId}`);
    } catch (error) {
      console.error(`--> Error uploading "${beach.name}":`, error.message);
    }
  }
  
  console.log("Bulk upload finished!");
  process.exit(0);
}

uploadData().catch((err) => {
  console.error("Fatal error during upload:", err);
  process.exit(1);
});
