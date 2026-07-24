/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
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
 * Calculate urgency score based on time to expiry
 * @param {Date|string} expires - Expiry date
 * @returns {Object} { score: number, level: string, hoursRemaining: number }
 */
export function calculateUrgency(expires) {
  const expiryDate = new Date(expires);
  const now = new Date();
  const hoursRemaining = (expiryDate - now) / (1000 * 60 * 60);

  if (hoursRemaining <= 0) {
    return { score: 100, level: 'EXPIRED', hoursRemaining: 0 };
  } else if (hoursRemaining <= 2) {
    return { score: 95, level: 'CRITICAL', hoursRemaining };
  } else if (hoursRemaining <= 6) {
    return { score: 85, level: 'HIGH', hoursRemaining };
  } else if (hoursRemaining <= 12) {
    return { score: 70, level: 'MEDIUM_HIGH', hoursRemaining };
  } else if (hoursRemaining <= 24) {
    return { score: 55, level: 'MEDIUM', hoursRemaining };
  } else if (hoursRemaining <= 48) {
    return { score: 35, level: 'LOW_MEDIUM', hoursRemaining };
  } else {
    return { score: 20, level: 'LOW', hoursRemaining };
  }
}

/**
 * Calculate food type priority
 * @param {string} foodType - PERISHABLE or NON_PERISHABLE
 * @returns {number} Priority score (0-100)
 */
export function getFoodTypePriority(foodType) {
  if (foodType === 'PERISHABLE') return 100;
  if (foodType === 'NON_PERISHABLE') return 30;
  return 50;
}

/**
 * Find NGOs within a certain radius
 * @param {Array} ngos - Array of NGO users with latitude/longitude
 * @param {number} lat - Donation latitude
 * @param {number} lng - Donation longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} NGOs within radius with distance
 */
export function findNGOsInRadius(ngos, lat, lng, radiusKm = 50) {
  return ngos
    .filter(ngo => ngo.latitude && ngo.longitude)
    .map(ngo => ({
      ...ngo,
      distance: calculateDistance(lat, lng, ngo.latitude, ngo.longitude)
    }))
    .filter(ngo => ngo.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}