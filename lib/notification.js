/**
 * Notification System for ShareBite
 * Handles email, push, and in-app notifications for matched NGOs
 */

import { prisma } from './prisma';

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data
        }
      });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(userId, options = {}) {
    const { unreadOnly = false, limit = 50, offset = 0 } = options;

    const where = {
      userId,
      ...(unreadOnly && { read: false })
    };

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.notification.count({
        where: { userId, read: false }
      })
    ]);

    return { notifications, unreadCount };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true }
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  /**
   * Send donation match notification to NGO
   */
  static async notifyDonationMatch(ngoId, donation, matchScore, distance) {
    const urgency = donation.foodType === 'PERISHABLE' ? 'HIGH' : 'MEDIUM';

    return this.createNotification(ngoId, 'NEW_DONATION_NEARBY',
      `New ${donation.foodType} donation nearby`,
      `${donation.title} (${donation.quantity}) is available ${distance}km away. Match score: ${matchScore}%. ${urgency === 'HIGH' ? '⚡ Urgent - expires soon!' : ''}`,
      {
        donationId: donation.id,
        matchScore,
        distance,
        urgency,
        foodType: donation.foodType
      }
    );
  }

  /**
   * Notify NGO when their claim is accepted
   */
  static async notifyClaimAccepted(ngoId, donation, donorName) {
    return this.createNotification(ngoId, 'DONATION_CLAIMED',
      'Donation claim accepted',
      `Your claim for "${donation.title}" has been accepted by ${donorName}. Please coordinate pickup.`,
      { donationId: donation.id }
    );
  }

  /**
   * Notify donor when NGO claims their donation
   */
  static async notifyDonorClaimed(donorId, donation, ngoName) {
    return this.createNotification(donorId, 'DONATION_CLAIMED',
      'Your donation has been claimed',
      `${ngoName} has claimed "${donation.title}". Please coordinate pickup details.`,
      { donationId: donation.id }
    );
  }

  /**
   * Notify when donation is collected
   */
  static async notifyCollected(userId, donation, collectorName) {
    return this.createNotification(userId, 'DONATION_COLLECTED',
      'Donation collected',
      `${collectorName} has collected "${donation.title}". Thank you for your contribution!`,
      { donationId: donation.id }
    );
  }

  /**
   * Send urgent alert for expiring donations
   */
  static async notifyExpiringSoon(donation, hoursLeft) {
    const ngos = await prisma.user.findMany({
      where: {
        role: 'NGO',
        latitude: { not: null },
        longitude: { not: null }
      }
    });

    const notifications = [];
    for (const ngo of ngos) {
      // Only notify nearby NGOs
      const distance = calculateDistance(
        donation.latitude, donation.longitude,
        ngo.latitude, ngo.longitude
      );

      if (distance <= 20) { // Within 20km
        const notification = await this.createNotification(ngo.id, 'DONATION_EXPIRING',
          'URGENT: Donation expiring soon',
          `"${donation.title}" expires in ${hoursLeft} hours. Located ${distance}km from you.`,
          { donationId: donation.id, hoursLeft, distance }
        );
        notifications.push(notification);
      }
    }

    return notifications;
  }

  /**
   * Send system-wide alert (for admins)
   */
  static async sendSystemAlert(title, message, data = {}) {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    const notifications = [];
    for (const admin of admins) {
      const notification = await this.createNotification(admin.id, 'SYSTEM_ALERT', title, message, data);
      notifications.push(notification);
    }

    return notifications;
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        read: true
      }
    });
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 100) / 100;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

export default NotificationService;