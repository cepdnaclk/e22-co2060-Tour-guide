import { saveItems, getItemById } from "../utils/offlineDb";
import { loadPlaces } from "./placeService";

export const downloadDistrictData = async (slug) => {
  const allPlaces = await loadPlaces();

  const districtPlaces = allPlaces.filter((p) => {
    const district = String(p.district || p.districtName || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    return district === slug;
  });

  await saveItems("places", districtPlaces);

  await saveItems("downloads", [
    {
      id: slug,
      type: "district",
      downloadedAt: Date.now(),
    },
  ]);

  return districtPlaces;
};

export const isDistrictDownloaded = async (slug) => {
  return await getItemById("downloads", slug);
};