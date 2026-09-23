import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Read Firebase Config
const firebaseJsContent = readFileSync("./src/firebase.js", "utf8");
const match = firebaseJsContent.match(/const\s+firebaseConfig\s*=\s*(\{[\s\S]*?\});/);
const firebaseConfig = new Function(`return ${match[1]}`)();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function cleanupDuplicateDoc() {
  const email = "uploader_temp_admin@example.com";
  const password = "TemporaryPassword123!";
  
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Authenticated with Firebase.");

  console.log("Deleting duplicate document: districts/kaluthara...");
  await deleteDoc(doc(db, "districts", "kaluthara"));
  console.log("✓ Deleted districts/kaluthara");

  console.log("Deleting duplicate document: places/district-kaluthara...");
  await deleteDoc(doc(db, "places", "district-kaluthara"));
  console.log("✓ Deleted places/district-kaluthara");

  console.log("🎉 Successfully kept ONLY the correct single document: 'kalutara'.");
  process.exit(0);
}

cleanupDuplicateDoc().catch((err) => {
  console.error("Error during deletion:", err);
  process.exit(1);
});
