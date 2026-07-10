import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { saveItems, getAllItems } from "../utils/offlineDb";

export const loadDistricts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "districts"));

    const districts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await saveItems("districts", districts);

    return districts;
  } catch (error) {
    console.error("Online fetch failed, loading offline districts:", error);
    return await getAllItems("districts");
  }
};