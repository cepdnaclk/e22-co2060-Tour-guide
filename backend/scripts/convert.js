const fs = require("fs");

const data = JSON.parse(fs.readFileSync("kandy_places.geojson", "utf8"));

function mapType(tags) {
  if (tags.amenity === "fuel") return "petrol_shed";
  if (tags.amenity === "bus_station") return "bus_stand";



  if (tags.railway === "station") return "railway_station";
  if (tags.public_transport === "station" && tags.station === "rail") {
    return "railway_station";
  }


  
  if (tags.shop === "car_repair" || tags["service:vehicle:car_repair"])
    return "car_repair";

  if (tags.amenity === "bicycle_rental") return "bike_rental";

  if (
    tags.amenity === "car_rental" ||
    tags["car:rental"] ||
    tags.shop === "rental"
  )
    return "car_rental";

  if (tags["motorcycle:rental"]) return "bike_rental";

  return null;
}

const places = [];

data.features.forEach((f) => {
  const tags = f.properties;

  const type = mapType(tags);

  if (!type) return;

  const coords = f.geometry.coordinates;

  places.push({
    name: tags.name || "Unknown Place",
    district: "kandy",
    placeType: type,
    lat: coords[1],
    lng: coords[0],
    isActive: true,
  });
});

fs.writeFileSync("firebase_places.json", JSON.stringify(places, null, 2));

console.log("Firebase dataset created!");