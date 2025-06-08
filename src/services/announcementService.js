import Announcement from '../models/Announcement.js';

class AnnouncementService {
  // Get all announcements for a customer
  async getAnnouncementsByCustomer(customerId) {
    return Announcement.find({ customer: customerId })
      .sort({ scheduled_time: -1 });
  }

  // Create a new announcement
  async createAnnouncement(announcementData) {
    try {
      const announcement = new Announcement(announcementData);
      return await announcement.save();
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  // Delete an announcement
  async deleteAnnouncement(announcementId, customerId) {
    try {
      return await Announcement.findOneAndDelete({
        _id: announcementId,
        customer: customerId
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }

  // Get a single announcement
  async getAnnouncement(announcementId, customerId) {
    try {
      return await Announcement.findOne({
        _id: announcementId,
        customer: customerId
      });
    } catch (error) {
      console.error('Error getting announcement:', error);
      throw error;
    }
  }

  // Update an announcement
  async updateAnnouncement(announcementId, customerId, updateData) {
    try {
      return await Announcement.findOneAndUpdate(
        { _id: announcementId, customer: customerId },
        updateData,
        { new: true }
      );
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  }

  // Get pending announcements that are due to be sent
  async getPendingAnnouncements() {
    const now = new Date();
    return Announcement.find({
      is_sent: false,
      scheduled_time: { $lte: now }
    }).populate('customer');
  }

  // Mark an announcement as sent
  async markAsSent(announcementId) {
    return Announcement.findByIdAndUpdate(
      announcementId,
      { is_sent: true },
      { new: true }
    );
  }

  // Get announcement statistics
  async getAnnouncementStats(customerId) {
    try {
      const announcements = await Announcement.find({ customer: customerId });
      
      return {
        totalAnnouncements: announcements.length,
        pendingAnnouncements: announcements.filter(a => !a.is_sent).length,
        sentAnnouncements: announcements.filter(a => a.is_sent).length
      };
    } catch (error) {
      console.error('Error getting announcement stats:', error);
      throw error;
    }
  }

  // Get sent announcements for history
  async getSentAnnouncements(customerId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const total = await Announcement.countDocuments({ 
        customer: customerId,
        is_sent: true 
      });

      const announcements = await Announcement.find({ 
        customer: customerId,
        is_sent: true 
      })
        .sort({ sent_time: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer');

      return {
        announcements,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting sent announcements:', error);
      throw error;
    }
  }
}

export default new AnnouncementService(); 