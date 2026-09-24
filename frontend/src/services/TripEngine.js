import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MOCK_PLACES, MOCK_DISTRICTS } from '../utils/mockPlaces';

// --- DISTRICT COORDINATES MAP FOR ALL MAJOR SRI LANKAN DISTRICTS ---
export const DISTRICT_COORDINATES = {
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Jaffna": { lat: 9.6615, lng: 80.0255 },
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Kurunegala": { lat: 7.4818, lng: 80.3609 },
  "Matale": { lat: 7.4728, lng: 80.6234 },
  "Dambulla": { lat: 7.8742, lng: 80.6511 },
  "Sigiriya": { lat: 7.9570, lng: 80.7603 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },
  "Ella": { lat: 6.8667, lng: 81.0466 },
  "Anuradhapura": { lat: 8.3114, lng: 80.4037 },
  "Polonnaruwa": { lat: 7.9403, lng: 81.0188 },
  "Trincomalee": { lat: 8.5874, lng: 81.2152 },
  "Badulla": { lat: 6.9934, lng: 81.0550 },
  "Batticaloa": { lat: 7.7310, lng: 81.6747 },
  "Ratnapura": { lat: 6.6828, lng: 80.3992 },
  "Hambantota": { lat: 6.1247, lng: 81.1185 },
  "Negombo": { lat: 7.2008, lng: 79.8737 },
  "Bentota": { lat: 6.4255, lng: 79.9972 },
  "Mirissa": { lat: 5.9483, lng: 80.4578 },
  "Tangalle": { lat: 6.0243, lng: 80.7941 },
  "Matara": { lat: 5.9549, lng: 80.5550 },
  "Wellawaya": { lat: 6.7381, lng: 81.1026 },
  "Ampara": { lat: 7.2912, lng: 81.6724 },
  "Kilinochchi": { lat: 9.3803, lng: 80.3992 },
  "Vavuniya": { lat: 8.7514, lng: 80.4971 },
  "Chilaw": { lat: 7.5758, lng: 79.7953 },
  "Puttalam": { lat: 8.0362, lng: 79.8283 },
  "Kalutara": { lat: 6.5854, lng: 79.9607 },
  "Kegalle": { lat: 7.2513, lng: 80.3464 },
  "Monaragala": { lat: 6.8714, lng: 81.3487 },
  "Mullaitivu": { lat: 9.2671, lng: 80.8142 },
  "Mannar": { lat: 8.9810, lng: 79.9044 },
  "Hikkaduwa": { lat: 6.1394, lng: 80.1063 },
  "Arugam Bay": { lat: 6.8417, lng: 81.8358 },
  "Pasikudah": { lat: 7.9234, lng: 81.5645 }
};

// Realistic Petrol/Fuel Rate per KM by Vehicle Type in Sri Lanka
export const VEHICLE_RATES = {
  "Bike": { ratePerKm: 10, defaultPersons: 2, label: "Bike (Rs. 10/km)" },
  "TukTuk": { ratePerKm: 15, defaultPersons: 3, label: "TukTuk (Rs. 15/km)" },
  "Car": { ratePerKm: 25, defaultPersons: 4, label: "Car (Rs. 25/km)" },
  "Van": { ratePerKm: 35, defaultPersons: 6, label: "Van (Rs. 35/km)" },
  "Bus": { ratePerKm: 45, defaultPersons: 15, label: "Bus (Rs. 45/km)" }
};

// Helper: Resolve coordinates for a given location string
function resolveCoordinates(locationName) {
  if (!locationName) return DISTRICT_COORDINATES["Colombo"];
  
  const cleanName = String(locationName).trim();
  for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (key.toLowerCase() === cleanName.toLowerCase()) return coords;
  }
  for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (key.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(key.toLowerCase())) return coords;
  }
  return MOCK_DISTRICTS[locationName] || DISTRICT_COORDINATES["Colombo"];
}

// Haversine distance formula (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

// Calculate projection progress on path (0.0 = Start, 1.0 = End) & perpendicular offset distance (km)
function getPathProjection(pLat, pLng, oLat, oLng, dLat, dLng) {
  const pathDist = calculateDistance(oLat, oLng, dLat, dLng);
  if (pathDist === 0) return { progress: 0, offPathKm: calculateDistance(pLat, pLng, oLat, oLng) };

  const startToP = calculateDistance(oLat, oLng, pLat, pLng);
  const pToEnd = calculateDistance(pLat, pLng, dLat, dLng);

  // Progress along journey
  const progress = Math.min(1.0, Math.max(0.0, (startToP / pathDist)));
  
  // Approximate off-path distance (km)
  const offPathKm = Math.max(0, (startToP + pToEnd) - pathDist);

  return { progress, offPathKm };
}

// --- FIRESTORE PLACE FETCHING ENGINE ---
function normalizePlace(id, d) {
  const name = d.name || d.title || "Attraction Spot";
  const district = d.district || d.districtName || d.location || d.city || "General";
  const lat = parseFloat(d.lat || d.latitude || 7.2906);
  const lng = parseFloat(d.lng || d.longitude || d.long || 80.6337);
  const ticketPrice = parseInt(d.ticketPrice || d.entranceFee || d.price || 0, 10);
  const categories = Array.isArray(d.categories) 
    ? d.categories 
    : (d.category ? [d.category] : [d.categoryTag || "General"]);
  const rating = parseFloat(d.rating || 4.5);
  const popularity = parseInt(d.popularity || 80, 10);
  const estimatedVisitTime = parseInt(d.estimatedVisitTime || d.visitDuration || 90, 10);

  return {
    id,
    name,
    district: String(district).trim(),
    lat,
    lng,
    categories,
    ticketPrice,
    openingHours: d.openingHours || { open: 6.0, close: 18.0 },
    rating,
    popularity,
    estimatedVisitTime,
    imageUrl: d.imageUrl || d.image || null
  };
}

export async function getPlacesFromFirestore() {
  let places = [];
  try {
    const snapshot = await getDocs(collection(db, "places"));
    snapshot.docs.forEach(doc => {
      const d = doc.data();
      if (d.isActive !== false && d.isactive !== false) {
        places.push(normalizePlace(doc.id, d));
      }
    });

    const categories = ["Beaches", "City", "Heritage", "Mountains", "Waterfalls", "Wildlife"];
    for (const cat of categories) {
      try {
        const catRef = collection(db, "Tourism", cat, "Places");
        const catSnapshot = await getDocs(catRef);
        catSnapshot.docs.forEach(doc => {
          const d = doc.data();
          if (d.isActive !== false) {
            places.push(normalizePlace(doc.id, { ...d, categoryTag: cat }));
          }
        });
      } catch (e) {
        // Ignore subcollection errors
      }
    }
  } catch (err) {
    console.warn("Firestore fetch notice in TripEngine:", err.message);
  }

  // Merge with local fallback dataset to guarantee rich places along all highways
  const merged = [...places];
  MOCK_PLACES.forEach(mp => {
    if (!merged.some(p => p.name.toLowerCase() === mp.name.toLowerCase())) {
      merged.push(normalizePlace(mp.id, mp));
    }
  });

  return merged;
}

// Scoring Engine
function scorePlace(place, context, currentLat, currentLng) {
  let score = 0;

  const distance = calculateDistance(currentLat, currentLng, place.lat, place.lng);
  const distanceScore = Math.max(0, 100 - (distance * 2));
  score += distanceScore * 0.25;

  if (context.interests && context.interests.length > 0) {
    const matchCount = place.categories.filter(c => 
      context.interests.some(userInt => String(c).toLowerCase().includes(userInt.toLowerCase()))
    ).length;
    const categoryScore = matchCount > 0 ? (matchCount / place.categories.length) * 100 : 0;
    score += categoryScore * 0.30;
  } else {
    score += 50 * 0.30;
  }

  score += (place.popularity || 80) * 0.20;

  if (place.ticketPrice > context.availableBudget) {
    return -1;
  }

  return score;
}

// 2-Opt Route Optimizer along geographical progression
function optimizeRouteAlongTrajectory(places, startLat, startLng, destLat, destLng) {
  if (places.length <= 1) return places;

  // Sort places based on their distance from origin along the path direction
  const sorted = [...places].sort((a, b) => {
    const distA = calculateDistance(startLat, startLng, a.lat, a.lng);
    const distB = calculateDistance(startLat, startLng, b.lat, b.lng);
    return distA - distB;
  });

  return sorted;
}

// Timeline Generator
function generateTimeline(route, context, startLat, startLng) {
  let timeline = [];
  let currentTime = 9 * 60; // 9:00 AM
  
  let currentLat = startLat;
  let currentLng = startLng;
  let totalCost = 0;
  let totalDistance = 0;

  for (let place of route) {
    const dist = calculateDistance(currentLat, currentLng, place.lat, place.lng);
    totalDistance += dist;
    
    const travelTimeMins = (dist / 40) * 60; // 40km/h avg speed
    currentTime += travelTimeMins;

    const arrivalTimeHrs = currentTime / 60;
    if (place.openingHours && arrivalTimeHrs < place.openingHours.open) {
      currentTime = place.openingHours.open * 60;
    }
    
    const startTimeStr = formatTime(currentTime);
    currentTime += (place.estimatedVisitTime || 90);
    const endTimeStr = formatTime(currentTime);
    
    totalCost += place.ticketPrice;

    timeline.push({
      ...place,
      arrivalTime: startTimeStr,
      departureTime: endTimeStr,
      travelDistance: dist.toFixed(1) + ' km',
      travelTimeMins: Math.round(travelTimeMins)
    });

    currentLat = place.lat;
    currentLng = place.lng;
  }

  return { timeline, totalCost, totalDistance, endTime: formatTime(currentTime) };
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// Find Alternative Nearby Destinations within Budget Radius
function findAlternativeDestinations(originCoords, userBudget, ratePerKm) {
  const maxOneWayKm = Math.floor((userBudget / ratePerKm) / 2);
  const alternatives = [];

  for (const [district, coords] of Object.entries(DISTRICT_COORDINATES)) {
    const dist = calculateDistance(originCoords.lat, originCoords.lng, coords.lat, coords.lng);
    if (dist > 5 && dist <= maxOneWayKm) {
      const estFuelCost = Math.round(dist * 2 * ratePerKm);
      alternatives.push({
        district,
        oneWayKm: Math.round(dist),
        estFuelCost
      });
    }
  }

  return alternatives.sort((a, b) => a.oneWayKm - b.oneWayKm).slice(0, 3);
}

// ------------------------------------------------------------------
// MAIN ENGINE EXPORT
// ------------------------------------------------------------------
export const TripOptimizationEngine = {
  
  generateTrip: async (context) => {
    const originCoords = resolveCoordinates(context.origin);
    const destCoords = resolveCoordinates(context.destination);

    const allPlaces = await getPlacesFromFirestore();

    const vehicleType = context.vehicleType || "Car";
    const vehicleConfig = VEHICLE_RATES[vehicleType] || VEHICLE_RATES["Car"];
    const ratePerKm = vehicleConfig.ratePerKm;
    
    const personCount = parseInt(context.personCount, 10) || vehicleConfig.defaultPersons;

    // Direct one-way distance between Origin & Destination
    const oneWayDistance = calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
    const roundTripDistance = oneWayDistance * 2;
    const estFuelCost = Math.round(roundTripDistance * ratePerKm);
    
    const userBudget = parseInt(context.budget, 10) || 5000;

    // --- BUDGET FEASIBILITY GUARD ---
    if (estFuelCost > userBudget && !context.allowOverBudget) {
      const altDestinations = findAlternativeDestinations(originCoords, userBudget, ratePerKm);
      return {
        isFeasible: false,
        warning: {
          oneWayDistance: Math.round(oneWayDistance),
          roundTripDistance: Math.round(roundTripDistance),
          estFuelCost,
          userBudget,
          shortage: estFuelCost - userBudget,
          vehicleType,
          ratePerKm,
          altDestinations
        }
      };
    }

    const availableBudgetForTickets = Math.max(0, userBudget - estFuelCost);
    let localContext = { ...context, budget: userBudget, availableBudget: availableBudgetForTickets };

    // --- EN-ROUTE TRAJECTORY SELECTION ENGINE ---
    let selectedPlaces = [];

    if (oneWayDistance > 60) {
      // Long distance trip (e.g., Kandy -> Jaffna, Batticaloa -> Galle):
      // Pick 2 En-Route Highway Pitstops + 2 Destination Highlights!
      
      const scoredAll = allPlaces.map(p => {
        const proj = getPathProjection(p.lat, p.lng, originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
        const score = scorePlace(p, localContext, p.lat, p.lng);
        return { place: p, progress: proj.progress, offPathKm: proj.offPathKm, score };
      }).filter(sp => sp.score >= 0 && sp.offPathKm <= 40);

      // Segment 1: Early En-Route (Progress 0.15 - 0.45) e.g., Dambulla / Matale
      const earlyEnRoute = scoredAll.filter(sp => sp.progress >= 0.15 && sp.progress < 0.45)
        .sort((a, b) => b.score - a.score);

      // Segment 2: Mid En-Route (Progress 0.45 - 0.75) e.g., Anuradhapura / Vavuniya / Kilinochchi
      const midEnRoute = scoredAll.filter(sp => sp.progress >= 0.45 && sp.progress < 0.75)
        .sort((a, b) => b.score - a.score);

      // Segment 3: Destination Highlights (Progress >= 0.75 or in destination district)
      const targetDestLower = String(context.destination || "").toLowerCase().trim();
      const destHighlights = allPlaces.filter(p => {
        const dLower = p.district.toLowerCase();
        return dLower.includes(targetDestLower) || targetDestLower.includes(dLower);
      }).map(p => ({ place: p, score: scorePlace(p, localContext, destCoords.lat, destCoords.lng) }))
        .filter(sp => sp.score >= 0)
        .sort((a, b) => b.score - a.score);

      // Pick top 1 from Early En-Route, top 1 from Mid En-Route, and top 2 from Destination Highlights
      if (earlyEnRoute.length > 0) selectedPlaces.push(earlyEnRoute[0].place);
      if (midEnRoute.length > 0) selectedPlaces.push(midEnRoute[0].place);
      
      destHighlights.forEach(dh => {
        if (selectedPlaces.length < 4 && !selectedPlaces.some(p => p.id === dh.place.id)) {
          selectedPlaces.push(dh.place);
        }
      });

      // If still < 3 places, fill from top scored places along route
      if (selectedPlaces.length < 3) {
        scoredAll.sort((a, b) => b.score - a.score).forEach(sp => {
          if (selectedPlaces.length < 4 && !selectedPlaces.some(p => p.id === sp.place.id)) {
            selectedPlaces.push(sp.place);
          }
        });
      }

    } else {
      // Local trip (distance <= 60km): Pick top 3-4 destination places
      const targetDestLower = String(context.destination || "").toLowerCase().trim();
      let candidates = allPlaces.filter(p => {
        const dLower = p.district.toLowerCase();
        return dLower.includes(targetDestLower) || targetDestLower.includes(dLower);
      });
      if (candidates.length === 0) {
        candidates = allPlaces.filter(p => calculateDistance(destCoords.lat, destCoords.lng, p.lat, p.lng) <= 60);
      }
      
      let scored = candidates.map(p => ({
        place: p,
        score: scorePlace(p, localContext, destCoords.lat, destCoords.lng)
      })).filter(sc => sc.score >= 0).sort((a, b) => b.score - a.score);

      selectedPlaces = scored.slice(0, 4).map(sc => sc.place);
    }

    // Sequence route geographically along path trajectory
    let optimizedRoute = optimizeRouteAlongTrajectory(selectedPlaces, originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);

    // Timeline Generation
    let timelineResult = generateTimeline(optimizedRoute, localContext, originCoords.lat, originCoords.lng);

    const totalDistanceKm = timelineResult.totalDistance + roundTripDistance;
    const finalFuelCost = Math.round(totalDistanceKm * ratePerKm);
    const totalTripCost = Math.round(finalFuelCost + timelineResult.totalCost);
    const costPerPerson = Math.round(totalTripCost / personCount);
    
    return {
      isFeasible: true,
      summary: {
        origin: context.origin || "Origin",
        destination: context.destination || "Destination",
        budget: `Rs. ${userBudget.toLocaleString()}`,
        totalCost: `Rs. ${totalTripCost.toLocaleString()}`,
        costPerPerson: `Rs. ${costPerPerson.toLocaleString()}`,
        personCount: personCount,
        vehicleType: vehicleType,
        ratePerKm: `Rs. ${ratePerKm}/km`,
        fuelCost: `Rs. ${finalFuelCost.toLocaleString()}`,
        ticketCost: `Rs. ${timelineResult.totalCost.toLocaleString()}`,
        distance: `${Math.round(totalDistanceKm)} km (Round Trip)`,
        duration: "1 Day Trip",
        attractionCount: timelineResult.timeline.length
      },
      timeline: timelineResult.timeline
    };
  }

};
