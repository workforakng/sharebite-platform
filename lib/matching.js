import { prisma } from './prisma';
import { calculateDistance, calculateUrgency, getFoodTypePriority, findNGOsInRadius } from './location';
import { callAI } from './ai';

/**
 * AI Agent for matching donations to the best NGOs
 * Uses multi-criteria scoring: distance, urgency, food type, NGO capacity
 */

export async function matchDonationToNGOs(donationId) {
  try {
    // Get the donation with donor location
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: {
          select: { latitude: true, longitude: true, address: true }
        }
      }
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    if (!donation.latitude || !donation.longitude) {
      throw new Error('Donation location not set');
    }

    // Get all active NGOs with location
    const ngos = await prisma.user.findMany({
      where: {
        role: 'NGO',
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        organizationName: true,
        phone: true,
        address: true,
        latitude: true,
        longitude: true,
        createdAt: true
      }
    });

    if (ngos.length === 0) {
      return { matches: [], message: 'No NGOs with location found' };
    }

    // Calculate scores for each NGO
    const matches = ngos.map(ngo => {
      const distance = calculateDistance(
        donation.latitude,
        donation.longitude,
        ngo.latitude,
        ngo.longitude
      );

      // Distance score (closer = higher score)
      const distanceScore = Math.max(0, 100 - distance * 2);

      // Urgency score
      const urgency = calculateUrgency(donation.expires);

      // Food type priority
      const foodTypePriority = getFoodTypePriority(donation.foodType);

      // NGO experience score (older NGOs might be more reliable)
      const ngoAgeDays = (Date.now() - new Date(ngo.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const experienceScore = Math.min(100, ngoAgeDays / 30 * 10); // 10 points per month, max 100

      // Composite score weights
      const weights = {
        distance: 0.35,
        urgency: 0.30,
        foodType: 0.20,
        experience: 0.15
      };

      const compositeScore = Math.round(
        distanceScore * weights.distance +
        urgency.score * weights.urgency +
        foodTypePriority * weights.foodType +
        experienceScore * weights.experience
      );

      return {
        ngo: {
          id: ngo.id,
          name: ngo.name,
          email: ngo.email,
          organizationName: ngo.organizationName,
          phone: ngo.phone,
          address: ngo.address,
          latitude: ngo.latitude,
          longitude: ngo.longitude
        },
        distance: Math.round(distance * 100) / 100,
        scores: {
          distance: Math.round(distanceScore),
          urgency: urgency.score,
          foodType: foodTypePriority,
          experience: Math.round(experienceScore),
          composite: compositeScore
        },
        urgency: urgency
      };
    });

    // Sort by composite score descending
    matches.sort((a, b) => b.scores.composite - a.scores.composite);

    // Return top 5 matches
    return {
      donationId,
      matches: matches.slice(0, 5),
      totalNGOs: ngos.length
    };
  } catch (error) {
    console.error('Error matching donation to NGOs:', error);
    throw error;
  }
}

/**
 * Trigger AI matching when a new donation is created
 * This can be called from the donation creation API
 */
export async function triggerAIMatching(donationId) {
  try {
    const result = await matchDonationToNGOs(donationId);

    // Notify top matches
    if (result.matches.length > 0) {
      await notifyMatchedNGOs(donationId, result.matches);
    }

    return result;
  } catch (error) {
    console.error('Error in AI matching:', error);
    throw error;
  }
}

/**
 * Send notifications to matched NGOs
 * @param {string} donationId - The donation ID
 * @param {Array} matches - Array of matched NGOs with scores
 */
export async function notifyMatchedNGOs(donationId, matches) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      donor: { select: { name: true, phone: true } }
    }
  });

  if (!donation) return;

  const topMatches = matches.slice(0, 3); // Notify top 3

  for (const match of topMatches) {
    try {
      // Create notification record
      await prisma.notification.create({
        data: {
          userId: match.ngo.id,
          type: 'DONATION_MATCH',
          title: `New Donation Match: ${donation.title}`,
          message: `You've been matched with a ${donation.foodType.toLowerCase()} donation: ${donation.title} (${donation.quantity}) at ${donation.location}. Distance: ${match.distance}km. Urgency: ${match.urgency.level}.`,
          data: {
            donationId,
            matchScore: match.scores.composite,
            distance: match.distance,
            urgency: match.urgency.level
          }
        }
      });

      // In production, send email/push notification here
      console.log(`Notification sent to NGO: ${match.ngo.name} (${match.ngo.email})`);
    } catch (notifyError) {
      console.error(`Failed to notify NGO ${match.ngo.id}:`, notifyError);
    }
  }
}

/**
 * Get pending matches for an NGO
 */
export async function getNGOMatches(ngoId) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: ngoId,
      type: 'DONATION_MATCH',
      read: false
    },
    orderBy: { createdAt: 'desc' },
    include: {
      donation: true
    }
  });

  return notifications;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId, userId) {
  return prisma.notification.update({
    where: { id: notificationId, userId },
    data: { read: true }
  });
}

/**
 * AI-enhanced matching using LLM for complex decisions
 * Falls back to algorithmic matching if AI unavailable
 */
export async function aiEnhancedMatch(donationId) {
  try {
    // First get algorithmic matches
    const algorithmicMatches = await matchDonationToNGOs(donationId);

    if (algorithmicMatches.matches.length === 0) {
      return algorithmicMatches;
    }

    // Use AI to refine top 3 matches
    const donation = await prisma.donation.findUnique({
      where: { id: donationId }
    });

    const topMatches = algorithmicMatches.matches.slice(0, 3);

    const prompt = `
      Donation: "${donation.title}" (${donation.foodType}, ${donation.quantity})
      Location: ${donation.location}
      Expires: ${donation.expires}
      Notes: ${donation.notes || 'None'}

      Top NGO Matches:
      ${topMatches.map((m, i) => `${i + 1}. ${m.ngo.organizationName || m.ngo.name} - ${m.distance}km away, Score: ${m.scores.composite}, Urgency: ${m.urgency.level}`).join('\n')}

      Return JSON with:
      - rankings: array of NGO IDs in order of best match
      - reasoning: brief explanation for ranking
      - specialConsiderations: any notes about food safety, timing, etc.
    `;

    const aiResult = await callAI(prompt, 'You are a food rescue logistics expert. Rank NGOs for optimal food rescue.');

    return {
      ...algorithmicMatches,
      aiEnhanced: aiResult,
      aiRankedMatches: topMatches.filter(m => aiResult.rankings?.includes(m.ngo.id))
    };
  } catch (error) {
    console.error('AI enhanced matching failed, using algorithmic:', error);
    return matchDonationToNGOs(donationId);
  }
}