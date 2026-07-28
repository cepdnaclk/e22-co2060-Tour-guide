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

// 3. Read JSON datasets
let beaches = [];
try {
  beaches = JSON.parse(readFileSync("./beaches.json", "utf8"));
  console.log(`Loaded ${beaches.length} beach records from beaches.json`);
} catch (error) {
  console.warn("Error reading beaches.json, skipping:", error.message);
}

let mountains = [];
try {
  mountains = JSON.parse(readFileSync("./mountains.json", "utf8"));
  console.log(`Loaded ${mountains.length} mountain records from mountains.json`);
} catch (error) {
  console.warn("Error reading mountains.json, skipping:", error.message);
}

let heritage = [];
try {
  heritage = JSON.parse(readFileSync("./heritage.json", "utf8"));
  console.log(`Loaded ${heritage.length} heritage records from heritage.json`);
} catch (error) {
  console.warn("Error reading heritage.json, skipping:", error.message);
}

let wildlife = [];
try {
  wildlife = JSON.parse(readFileSync("./wildlife.json", "utf8"));
  console.log(`Loaded ${wildlife.length} wildlife records from wildlife.json`);
} catch (error) {
  console.warn("Error reading wildlife.json, skipping:", error.message);
}

let waterfalls = [];
try {
  waterfalls = JSON.parse(readFileSync("./waterfalls.json", "utf8"));
  console.log(`Loaded ${waterfalls.length} waterfall records from waterfalls.json`);
} catch (error) {
  console.warn("Error reading waterfalls.json, skipping:", error.message);
}

let city = [];
try {
  city = JSON.parse(readFileSync("./city.json", "utf8"));
  console.log(`Loaded ${city.length} city records from city.json`);
} catch (error) {
  console.warn("Error reading city.json, skipping:", error.message);
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
  
  if (beaches.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/Beaches/Places");
    for (const beach of beaches) {
      try {
        const docId = beach.name
          .toLowerCase()
          .replace(/ beach$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading beach: "${beach.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "Beaches", "Places", docId);
        await setDoc(docRef, beach);
        console.log(`--> Success! Document created at path: Tourism/Beaches/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${beach.name}":`, error.message);
      }
    }
  }

  if (mountains.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/Mountains/Places");
    for (const mt of mountains) {
      try {
        const docId = mt.name
          .toLowerCase()
          .replace(/ mountain$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading mountain: "${mt.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "Mountains", "Places", docId);
        await setDoc(docRef, mt);
        console.log(`--> Success! Document created at path: Tourism/Mountains/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${mt.name}":`, error.message);
      }
    }
  }

  if (heritage.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/Heritage/Places");
    for (const h of heritage) {
      try {
        const docId = h.name
          .toLowerCase()
          .replace(/ (fort|temple|city)$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading heritage: "${h.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "Heritage", "Places", docId);
        await setDoc(docRef, h);
        console.log(`--> Success! Document created at path: Tourism/Heritage/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${h.name}":`, error.message);
      }
    }
  }

  if (wildlife.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/Wildlife/Places");
    for (const w of wildlife) {
      try {
        const docId = w.name
          .toLowerCase()
          .replace(/ (national park|park)$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading wildlife: "${w.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "Wildlife", "Places", docId);
        await setDoc(docRef, w);
        console.log(`--> Success! Document created at path: Tourism/Wildlife/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${w.name}":`, error.message);
      }
    }
  }

  if (waterfalls.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/Waterfalls/Places");
    for (const wf of waterfalls) {
      try {
        const docId = wf.name
          .toLowerCase()
          .replace(/ (falls|waterfall)$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading waterfall: "${wf.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "Waterfalls", "Places", docId);
        await setDoc(docRef, wf);
        console.log(`--> Success! Document created at path: Tourism/Waterfalls/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${wf.name}":`, error.message);
      }
    }
  }

  if (city.length > 0) {
    console.log("Starting bulk upload to Firestore subcollection: Tourism/City/Places");
    for (const c of city) {
      try {
        const docId = c.name
          .toLowerCase()
          .replace(/ (market|arcade|centre)$/i, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        console.log(`Uploading city: "${c.name}" as document "${docId}"...`);
        
        const docRef = doc(db, "Tourism", "City", "Places", docId);
        await setDoc(docRef, c);
        console.log(`--> Success! Document created at path: Tourism/City/Places/${docId}`);
      } catch (error) {
        console.error(`--> Error uploading "${c.name}":`, error.message);
      }
    }
  }
  
  console.log("Bulk upload finished!");
  process.exit(0);
}

uploadData().catch((err) => {
  console.error("Fatal error during upload:", err);
  process.exit(1);
});
