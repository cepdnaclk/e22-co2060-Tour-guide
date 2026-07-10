import { openDB } from "idb";

const DB_NAME = "perfect-guide-db";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("districts")) {
        db.createObjectStore("districts", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("places")) {
        db.createObjectStore("places", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("tripPlans")) {
        db.createObjectStore("tripPlans", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("downloads")) {
        db.createObjectStore("downloads", { keyPath: "id" });
      }
    },
  });
};

export const saveItems = async (storeName, items) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");

  for (const item of items) {
    await tx.store.put(item);
  }

  await tx.done;
};

export const getAllItems = async (storeName) => {
  const db = await initDB();
  return db.getAll(storeName);
};

export const getItemById = async (storeName, id) => {
  const db = await initDB();
  return db.get(storeName, id);
};

export const deleteItem = async (storeName, id) => {
  const db = await initDB();
  return db.delete(storeName, id);
};

export const clearStore = async (storeName) => {
  const db = await initDB();
  return db.clear(storeName);
};