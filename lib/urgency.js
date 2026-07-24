/**
 * Urgency scoring utilities for food donations
 * Calculates urgency based on time-to-expiry, food type, and quantity
 */

export function calculateUrgencyScore(donation) {
  const {
    expires,
    type,
    quantity,
    pickupStart,
    pickupEnd,
    createdAt
  } = donation;

  const now = new Date();
  const expiryDate = new Date(expires);
  const hoursUntilExpiry = (expiryDate - now) / (1000 * 60 * 60);

  // Base urgency score (0-100)
  let score = 0;

  // 1. Time-to-expiry scoring (0-50 points)
  if (hoursUntilExpiry <= 0) {
    score += 50; // Already expired - critical
  } else if (hoursUntilExpiry <= 2) {
    score += 45; // Less than 2 hours
  } else if (hoursUntilExpiry <= 6) {
    score += 35; // Less than 6 hours
  } else if (hoursUntilExpiry <= 12) {
    score += 25; // Less than 12 hours
  } else if (hoursUntilExpiry <= 24) {
    score += 15; // Less than 24 hours
  } else if (hoursUntilExpiry <= 48) {
    score += 10; // Less than 48 hours
  } else {
    score += 5; // More than 48 hours
  }

  // 2. Food type scoring (0-20 points)
  const perishableTypes = [
    'fresh produce', 'vegetables', 'fruits', 'dairy', 'milk', 'cheese', 'yogurt',
    'meat', 'chicken', 'fish', 'seafood', 'eggs', 'bread', 'bakery', 'pastries',
    'prepared meals', 'cooked food', 'salads', 'sandwiches', 'sushi'
  ];

  const semiPerishableTypes = [
    'canned', 'packaged', 'dry goods', 'grains', 'rice', 'pasta', 'flour',
    'cereals', 'snacks', 'biscuits', 'chocolate', 'nuts', 'dried fruits'
  ];

  const typeLower = (type || '').toLowerCase();

  if (perishableTypes.some(t => typeLower.includes(t))) {
    score += 20; // Highly perishable
  } else if (semiPerishableTypes.some(t => typeLower.includes(t))) {
    score += 10; // Semi-perishable
  } else {
    score += 5; // Unknown/other
  }

  // 3. Quantity scoring (0-15 points)
  // Higher quantity = more urgent to distribute
  const qty = parseQuantity(quantity);
  if (qty >= 100) score += 15;
  else if (qty >= 50) score += 10;
  else if (qty >= 20) score += 7;
  else if (qty >= 10) score += 5;
  else score += 2;

  // 4. Pickup window urgency (0-15 points)
  if (pickupStart && pickupEnd) {
    const startTime = new Date(pickupStart);
    const endTime = new Date(pickupEnd);
    const windowHours = (endTime - startTime) / (1000 * 60 * 60);

    if (windowHours <= 1) score += 15; // Very narrow window
    else if (windowHours <= 3) score += 10;
    else if (windowHours <= 6) score += 5;
    else score += 2;
  }

  return Math.min(score, 100); // Cap at 100
}

function parseQuantity(quantityStr) {
  if (!quantityStr) return 1;
  const match = quantityStr.toString().match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

export function getUrgencyLevel(score) {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  if (score >= 20) return 'LOW';
  return 'MINIMAL';
}

export function getSuggestedAction(score, donation) {
  if (score >= 80) {
    return 'IMMEDIATE_DISPATCH - Contact nearest NGO/volunteer now';
  } else if (score >= 60) {
    return 'URGENT_MATCH - Find match within 2 hours';
  } else if (score >= 40) {
    return 'PRIORITY_MATCH - Find match within 6 hours';
  } else if (score >= 20) {
    return 'STANDARD_MATCH - Find match within 24 hours';
  }
  return 'FLEXIBLE_MATCH - No immediate rush';
}