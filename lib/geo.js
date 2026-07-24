/**
 * Geographic utility functions for location-based matching
 */

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get coordinates from a location string (city, address, etc.)
 * In production, this would use a geocoding API like Google Maps Geocoding API
 * For now, we'll use a simple lookup for common Indian cities
 */
export async function getCoordinatesFromLocation(location) {
  const cityCoordinates = {
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'thane': { lat: 19.2183, lng: 72.9781 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'pimpri-chinchwad': { lat: 18.6298, lng: 73.7997 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'ghaziabad': { lat: 28.6692, lng: 77.4538 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'kalyan-dombivali': { lat: 19.2437, lng: 73.1355 },
    'vasai-virar': { lat: 19.4912, lng: 72.8054 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'srinagar': { lat: 34.0837, lng: 74.7973 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'dhanbad': { lat: 23.7957, lng: 86.4304 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'navi-mumbai': { lat: 19.0330, lng: 73.0297 },
    'allahabad': { lat: 25.4358, lng: 81.8463 },
    'howrah': { lat: 22.5958, lng: 88.2636 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'gwalior': { lat: 26.2183, lng: 78.1828 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'solapur': { lat: 17.6599, lng: 75.9064 },
    'hubli-dharwad': { lat: 15.3647, lng: 75.1240 },
    'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'bareilly': { lat: 28.3670, lng: 79.4304 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'tiruppur': { lat: 11.1085, lng: 77.3411 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'noida': { lat: 28.5355, lng: 77.3910 },
    'gurugram': { lat: 28.4595, lng: 77.0266 },
  };

  const normalized = location.toLowerCase().trim();

  // Try exact match first
  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }

  // Try partial match
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return coords;
    }
  }

  // Default to Mumbai if not found
  return cityCoordinates['mumbai'];
}

/**
 * Find NGOs within a certain radius of a donation location
 * @param {Array} ngos - Array of NGO users with latitude/longitude
 * @param {number} lat - Donation latitude
 * @param {number} lng - Donation longitude
 * @param {number} maxDistanceKm - Maximum distance in kilometers
 * @returns {Array} NGOs within range with distance property
 */
export function findNGOsInRange(ngos, lat, lng, maxDistanceKm = 50) {
  return ngos
    .map(ngo => {
      if (ngo.latitude == null || ngo.longitude == null) return null;
      const distance = calculateDistance(lat, lng, ngo.latitude, ngo.longitude);
      return { ...ngo, distance };
    })
    .filter(ngo => ngo !== null && ngo.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
}