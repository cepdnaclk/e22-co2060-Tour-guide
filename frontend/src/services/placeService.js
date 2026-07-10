import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { saveItems, getAllItems } from "../utils/offlineDb";

export const loadPlaces = async () => {
  try {
    const snapshot = await getDocs(collection(db, "places"));

    const places = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await saveItems("places", places);

    return places;
  } catch (error) {
    console.error("Online fetch failed, loading offline places:", error);
    return await getAllItems("places");
  }
};