import { MOCK_PLACES, MOCK_DISTRICTS } from '../utils/mockPlaces';

// Utility: Haversine distance formula to calculate distance between two lat/lng points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

// ------------------------------------------------------------------
// SCORING ENGINE
// ------------------------------------------------------------------
function scorePlace(place, context, currentLat, currentLng) {
  let score = 0;

  // 1. Distance (25%) - Closer is better
  const distance = calculateDistance(currentLat, currentLng, place.lat, place.lng);
  const distanceScore = Math.max(0, 100 - (distance * 2)); // 50km = 0 score, 0km = 100 score
  score += distanceScore * 0.25;

  // 2. Category Match (30%)
  if (context.interests && context.interests.length > 0) {
    const matchCount = place.categories.filter(c => context.interests.includes(c)).length;
    const categoryScore = matchCount > 0 ? (matchCount / place.categories.length) * 100 : 0;
    score += categoryScore * 0.30;
  } else {
    score += 50 * 0.30; // Default if no interests specified
  }

  // 3. Popularity (20%)
  score += place.popularity * 0.20;

  // 4. Budget Check (Critical filter masquerading as a score penalty here, hard filtered later)
  if (place.ticketPrice > context.availableBudget) {
    return -1; // Unaffordable
  }

  return score;
}

// ------------------------------------------------------------------
// ROUTE ENGINE (Nearest Neighbor + 2-Opt)
// ------------------------------------------------------------------
function optimizeRoute(places, startLat, startLng) {
  if (places.length <= 1) return places;

  // Nearest Neighbor Initialization
  let unvisited = [...places];
  let route = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(currentLat, currentLng, unvisited[i].lat, unvisited[i].lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nearestPlace = unvisited.splice(nearestIdx, 1)[0];
    route.push(nearestPlace);
    currentLat = nearestPlace.lat;
    currentLng = nearestPlace.lng;
  }

  // 2-Opt Improvement
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 1; i++) {
      for (let k = i + 1; k < route.length; k++) {
        const routeClone = [...route];
        const newRoute = reverseSubArray(routeClone, i, k);
        if (calculateTotalDistance(newRoute, startLat, startLng) < calculateTotalDistance(route, startLat, startLng)) {
          route = newRoute;
          improved = true;
        }
      }
    }
  }

  return route;
}

function reverseSubArray(arr, i, k) {
  const reversed = arr.slice(i, k + 1).reverse();
  arr.splice(i, k - i + 1, ...reversed);
  return arr;
}

function calculateTotalDistance(route, startLat, startLng) {
  if (route.length === 0) return 0;
  let dist = calculateDistance(startLat, startLng, route[0].lat, route[0].lng);
  for (let i = 0; i < route.length - 1; i++) {
    dist += calculateDistance(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng);
  }
  return dist;
}

// ------------------------------------------------------------------
// TIMELINE GENERATOR
// ------------------------------------------------------------------
function generateTimeline(route, context, startLat, startLng) {
  let timeline = [];
  // Start at 9:00 AM by default if not specified
  let currentTime = 9 * 60; // in minutes from midnight
  
  let currentLat = startLat;
  let currentLng = startLng;
  let totalCost = 0;
  let totalDistance = 0;

  for (let place of route) {
    // Distance from current location to place
    const dist = calculateDistance(currentLat, currentLng, place.lat, place.lng);
    totalDistance += dist;
    
    // Average speed 40km/h in Sri Lanka
    const travelTimeMins = (dist / 40) * 60;
    
    // Add travel time
    currentTime += travelTimeMins;

    // Check opening hours (if we arrive too early, wait. If too late, skip - but for now just log it)
    const arrivalTimeHrs = currentTime / 60;
    if (arrivalTimeHrs < place.openingHours.open) {
      currentTime = place.openingHours.open * 60; // wait till open
    }
    
    const startTimeStr = formatTime(currentTime);
    
    // Add visit duration
    currentTime += place.estimatedVisitTime;
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

// ------------------------------------------------------------------
// MAIN ENGINE EXPORT
// ------------------------------------------------------------------
export const TripOptimizationEngine = {
  
  generateTrip: (context) => {
    // 1. Resolve Origin/Destination Coords
    const originCoords = MOCK_DISTRICTS[context.origin] || MOCK_DISTRICTS["Kandy"];
    const destCoords = MOCK_DISTRICTS[context.destination] || MOCK_DISTRICTS["Kurunegala"];

    // 2. Budget Engine Initialization
    const fuelPrice = context.fuelPrice || 400; // default Rs 400/L
    const mileage = context.vehicleMileage || 30; // default 30km/L
    // rough distance estimate Kandy to Kurunegala is ~45km. Fuel = (45/30)*400 = 600
    const estDistance = calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
    const estFuelCost = (estDistance / mileage) * fuelPrice * 2; // round trip
    
    const availableBudgetForTickets = context.budget - estFuelCost;
    let localContext = { ...context, availableBudget: availableBudgetForTickets };

    // 3. Place Filtering & Scoring Engine
    let candidates = MOCK_PLACES.filter(p => p.district === context.destination);
    
    // Score them
    let scoredCandidates = candidates.map(p => ({
      place: p,
      score: scorePlace(p, localContext, destCoords.lat, destCoords.lng)
    })).filter(sc => sc.score >= 0) // Remove unaffordable ones
      .sort((a, b) => b.score - a.score);

    // Take top 3 for a day trip
    let selectedPlaces = scoredCandidates.slice(0, 3).map(sc => sc.place);

    // 4. Route Optimization
    let optimizedRoute = optimizeRoute(selectedPlaces, originCoords.lat, originCoords.lng);

    // 5. Timeline Generation
    let timelineResult = generateTimeline(optimizedRoute, localContext, originCoords.lat, originCoords.lng);

    // 6. Summary Generation
    const totalDistanceKm = timelineResult.totalDistance + (estDistance * 2); // Internal routing + to/from
    const finalFuelCost = (totalDistanceKm / mileage) * fuelPrice;
    
    return {
      summary: {
        origin: context.origin,
        destination: context.destination,
        budget: `Rs. ${context.budget}`,
        totalCost: `Rs. ${Math.round(finalFuelCost + timelineResult.totalCost)}`,
        fuelCost: `Rs. ${Math.round(finalFuelCost)}`,
        ticketCost: `Rs. ${timelineResult.totalCost}`,
        distance: `${Math.round(totalDistanceKm)} km`,
        duration: "1 Day Trip",
        attractionCount: timelineResult.timeline.length
      },
      timeline: timelineResult.timeline
    };
  }

};
