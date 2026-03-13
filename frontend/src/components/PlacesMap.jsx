import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getCenter(places) {
  if (!places || places.length === 0) {
    return [7.2906, 80.6337]; // fallback center (Kandy)
  }

  const valid = places.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );

  if (valid.length === 0) {
    return [7.2906, 80.6337];
  }

  const avgLat =
    valid.reduce((sum, p) => sum + p.lat, 0) / valid.length;
  const avgLng =
    valid.reduce((sum, p) => sum + p.lng, 0) / valid.length;

  return [avgLat, avgLng];
}

export default function PlacesMap({ title, places, height = "420px" }) {
  const validPlaces = (places || []).filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );

  const center = getCenter(validPlaces);

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {validPlaces.length === 0 ? (
        <p className="text-gray-600">No map data available.</p>
      ) : (
        <div style={{ height }}>
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "16px" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {validPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
              >
                <Popup>
                  <div>
                    <strong>{place.name}</strong>
                    <br />
                    {(place.placeType || place.category || "place").replaceAll("_", " ")}
                    <br />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Maps
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}