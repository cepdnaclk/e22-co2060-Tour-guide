import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;