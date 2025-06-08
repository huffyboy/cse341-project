import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getAnnouncements,
  getAnnouncementDetails,
  createAnnouncement,
  deleteAnnouncement,
  getEditForm,
  updateAnnouncement,
  getNewForm,
  getAnnouncementHistory
} from '../controllers/announcementController.js';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// List all announcements
router.get('/announcements', getAnnouncements);

// Get announcement history
router.get('/announcements/history', getAnnouncementHistory);

// Get new announcement form
router.get('/announcements/create', getNewForm);

// Create new announcement
router.post('/announcements', createAnnouncement);

// Get edit form
router.get('/announcements/:id/edit', getEditForm);

// Update announcement
router.put('/announcements/:id', updateAnnouncement);

// Delete announcement
router.delete('/announcements/:id', deleteAnnouncement);

// Get announcement details (must be last since it's a catch-all)
router.get('/announcements/:id', getAnnouncementDetails);

export default router; 