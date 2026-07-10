import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { saveItems, getAllItems } from "../utils/offlineDb";

export const loadServices = async () => {
  try {
    const snapshot = await getDocs(collection(db, "services"));

    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await saveItems("services", services);

    return services;
  } catch (error) {
    console.error("Online fetch failed, loading offline services:", error);
    return await getAllItems("services");
  }
};