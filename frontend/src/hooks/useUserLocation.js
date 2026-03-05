import { useEffect, useState } from "react";

export function useUserLocation() {
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError(err.message || "Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { coords, error };
}