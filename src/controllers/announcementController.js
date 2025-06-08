import announcementService from '../services/announcementService.js';
import Announcement from '../models/Announcement.js';

// Get all announcements for the current customer
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementService.getAnnouncementsByCustomer(req.user._id);
    res.render('announcements', { announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).render('error', { message: 'Error fetching announcements' });
  }
};

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { content, scheduled_time } = req.body;
    const announcement = await announcementService.createAnnouncement({
      content,
      scheduled_time,
      customer: req.user._id
    });
    res.redirect('/dashboard/announcements');
  } catch (error) {
    console.warn('Error creating announcement:', error);
    res.render('dashboard/announcements/create', { 
      error: 'Failed to create announcement. Please try again.',
      formData: req.body
    });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await announcementService.deleteAnnouncement(
      req.params.id,
      req.user._id
    );
    
    if (!announcement) {
      return res.status(404).render('error', { message: 'Announcement not found' });
    }
    
    res.redirect('/dashboard/announcements');
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).render('error', { message: 'Error deleting announcement' });
  }
};

// Get form to edit an announcement
export const getEditForm = async (req, res) => {
  try {
    const announcement = await announcementService.getAnnouncement(
      req.params.id,
      req.user._id
    );
    
    if (!announcement) {
      return res.status(404).render('error', { message: 'Announcement not found' });
    }
    
    res.render('announcements/edit', { announcement });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).render('error', { message: 'Error fetching announcement' });
  }
};

// Update an announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { content, scheduled_time } = req.body;
    const announcement = await announcementService.updateAnnouncement(
      req.params.id,
      req.user._id,
      { content, scheduled_time }
    );
    
    if (!announcement) {
      return res.status(404).render('error', { message: 'Announcement not found' });
    }
    
    res.redirect('/dashboard/announcements');
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).render('error', { message: 'Error updating announcement' });
  }
};

// Get new announcement form
export const getNewForm = (req, res) => {
  res.render('announcements/new');
};

// Get announcement history
export const getAnnouncementHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { announcements, total, totalPages } = await announcementService.getSentAnnouncements(
            req.user.customer,
            page
        );

        res.render('dashboard/announcements/history', {
            announcements,
            page,
            total,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching announcement history:', error);
        req.flash('error', 'Failed to fetch announcement history');
        res.redirect('/dashboard/announcements');
    }
};

// Get announcement details
export const getAnnouncementDetails = async (req, res) => {
  try {
    const announcement = await announcementService.getAnnouncement(
      req.params.id,
      req.user._id
    );
    
    if (!announcement) {
      return res.status(404).render('error', { message: 'Announcement not found' });
    }
    
    res.render('announcements/details', { announcement });
  } catch (error) {
    console.error('Error fetching announcement details:', error);
    res.status(500).render('error', { message: 'Error fetching announcement details' });
  }
}; 