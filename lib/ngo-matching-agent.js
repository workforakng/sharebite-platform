/**
 * AI Agent for NGO Matching and Auto-Notification
 * Evaluates all NGOs and selects best matches based on multi-criteria scoring
 */

import { prisma } from './prisma';
import { calculateDistance } from './geo';
import { calculateUrgencyScore, getUrgencyLevel, getSuggestedAction } from './urgency';
import { callAI } from './ai';
import NotificationService from './notification';

export class NGOMatchingAgent {
  /**
   * Find the best NGO matches for a donation
   * @param {Object} donation - The donation object
   * @param {number} maxMatches - Maximum number of matches to return
   * @returns {Array} Ranked array of NGO matches with scores
   */
  static async findBestMatches(donation, maxMatches = 5) {
    // Get all active NGOs with location data
    const ngoProfiles = await prisma.nGOProfile.findMany({
      where: {
        isActive: true,
        latitude: { not: null },
        longitude: { not: null }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (ngoProfiles.length === 0) {
      return [];
    }

    // Calculate urgency score for the donation
    const urgencyScore = calculateUrgencyScore(donation);
    const urgencyLevel = getUrgencyLevel(urgencyScore);

    // Score each NGO
    const scoredNGOs = ngoProfiles.map(ngo => {
      const distance = calculateDistance(
        donation.latitude,
        donation.longitude,
        ngo.latitude,
        ngo.longitude
      );

      // Distance score (0-40 points, closer is better)
      let distanceScore = 0;
      if (distance <= 5) distanceScore = 40;
      else if (distance <= 10) distanceScore = 30;
      else if (distance <= 20) distanceScore = 20;
      else if (distance <= 50) distanceScore = 10;
      else distanceScore = 0;

      // Capacity match score (0-20 points)
      // Based on NGO capacity
      const capacityScore = Math.min(20, ngo.capacity / 10);

      // Food type match score (0-20 points)
      // Check if NGO accepts this food type
      const foodTypeMatch = ngo.foodTypes?.includes(donation.foodType) ||
                           ngo.foodTypes?.includes('ALL') ? 20 : 10;

      // Urgency alignment (0-20 points)
      // Higher urgency donations get priority
      const urgencyAlignment = Math.min(20, urgencyScore / 5);

      const totalScore = distanceScore + capacityScore + foodTypeMatch + urgencyAlignment;

      return {
        ngo: {
          id: ngo.id,
          userId: ngo.userId,
          name: ngo.name,
          email: ngo.user.email,
          phone: ngo.user.phone,
          address: ngo.address,
          latitude: ngo.latitude,
          longitude: ngo.longitude,
          capacity: ngo.capacity,
          foodTypes: ngo.foodTypes,
          operatingHours: ngo.operatingHours
        },
        distance: Math.round(distance * 100) / 100,
        scores: {
          distance: distanceScore,
          capacity: Math.round(capacityScore),
          foodType: foodTypeMatch,
          urgencyAlignment: Math.round(urgencyAlignment)
        },
        totalScore: Math.round(totalScore),
        urgencyLevel,
        urgencyScore,
        suggestedAction: getSuggestedAction(urgencyScore, donation)
      };
    });

    // Sort by total score descending
    scoredNGOs.sort((a, b) => b.totalScore - a.totalScore);

    // Return top matches
    return scoredNGOs.slice(0, maxMatches);
  }

  /**
   * Auto-notify best matched NGOs about a new donation
   * @param {Object} donation - The donation object
   * @param {Array} matches - Array of NGO matches from findBestMatches
   * @returns {Object} Notification results
   */
  static async notifyMatchedNGOs(donation, matches) {
    return NotificationService.notifyDonationMatch(
      matches[0].ngo.userId,
      donation,
      matches[0].totalScore,
      matches[0].distance
    );
  }

  /**
   * Full matching and notification pipeline
   * Called when a new donation is created
   * @param {Object} donation - The new donation
   * @returns {Object} Matching and notification results
   */
  static async processNewDonation(donation) {
    try {
      // Find best matches
      const matches = await this.findBestMatches(donation, 5);

      if (matches.length === 0) {
        return {
          success: false,
          message: 'No active NGOs with location data found',
          matches: [],
          notifications: []
        };
      }

      // Notify top matches (only notify if score > 40)
      const qualifiedMatches = matches.filter(m => m.totalScore >= 40);
      const notifications = await this.notifyMatchedNGOs(donation, qualifiedMatches);

      // Also notify admin if high urgency
      if (matches[0].urgencyLevel === 'CRITICAL' || matches[0].urgencyLevel === 'HIGH') {
        await this.notifyAdmins(donation, matches[0]);
      }

      // Create DonationMatch records for top matches
      const matchRecords = await Promise.all(
        matches.slice(0, 3).map(match =>
          prisma.donationMatch.create({
            data: {
              donationId: donation.id,
              ngoId: match.ngo.id,
              score: match.totalScore,
              status: 'PENDING'
            }
          })
        )
      );

      return {
        success: true,
        donationId: donation.id,
        urgencyLevel: matches[0].urgencyLevel,
        urgencyScore: matches[0].urgencyScore,
        matches: matches.map(m => ({
          ngoId: m.ngo.id,
          ngoName: m.ngo.name,
          distance: m.distance,
          totalScore: m.totalScore,
          urgencyLevel: m.urgencyLevel
        })),
        notifications,
        matchRecords
      };
    } catch (error) {
      console.error('Error in donation matching pipeline:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Notify admins about critical donations
   */
  static async notifyAdmins(donation, topMatch) {
    await NotificationService.sendSystemAlert(
      `CRITICAL: High urgency donation needs attention`,
      `${donation.title} (${donation.quantity}) expires soon. Top match: ${topMatch.ngo.name} at ${topMatch.distance}km`,
      {
        donationId: donation.id,
        urgencyLevel: topMatch.urgencyLevel,
        topMatchId: topMatch.ngo.id
      }
    );
  }

  /**
   * Use AI to enhance matching with semantic understanding
   * @param {Object} donation - The donation object
   * @param {Array} ngoProfiles - Array of NGOProfile objects
   * @returns {Array} AI-enhanced matches
   */
  static async enhanceWithAI(donation, ngoProfiles) {
    const prompt = `You are an AI matching agent for food rescue. Match this donation to the best NGOs.

Donation:
- Title: ${donation.title}
- Type: ${donation.type}
- Quantity: ${donation.quantity}
- Food Type: ${donation.foodType}
- Location: ${donation.address} (${donation.latitude}, ${donation.longitude})
- Expires: ${donation.expiryDate}
- Pickup Window: ${donation.pickupStart} to ${donation.pickupEnd}
- Notes: ${donation.description || 'None'}

NGOs:
${ngoProfiles.map((ngo, i) => `${i + 1}. ${ngo.name} - ${ngo.address} (${ngo.latitude}, ${ngo.longitude}) Capacity: ${ngo.capacity}, Food Types: ${ngo.foodTypes?.join(', ')}`).join('\n')}

Return JSON with ranked matches: [{"ngoIndex": 1, "reason": "string", "confidence": 0-100}]`;

    try {
      const aiResult = await callAI(prompt, 'You are a food rescue matching AI. Return valid JSON only.');

      if (aiResult && Array.isArray(aiResult)) {
        // Combine AI results with algorithmic scores
        return aiResult.map(ai => {
          const ngo = ngoProfiles[ai.ngoIndex - 1];
          return {
            ...ai,
            ngo,
            aiReason: ai.reason,
            aiConfidence: ai.confidence
          };
        });
      }
    } catch (error) {
      console.warn('AI matching enhancement failed:', error.message);
    }

    return [];
  }
}

export default NGOMatchingAgent;