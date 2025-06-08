import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { checkAccountSetup, checkAccountSetupForAnnouncements } from '../middlewares/accountSetup.js';
import { getLanding } from '../controllers/landingController.js';
import authRoutes from './auth.js';
import dashboardRoutes from './dashboard.js';
import announcementRoutes from './announcements.js';

const router = express.Router();

// Public routes
router.get('/', getLanding);
router.use('/auth', authRoutes);

// Protected routes
router.use('/dashboard', isAuthenticated, checkAccountSetup, dashboardRoutes);
router.use('/dashboard/announcements', isAuthenticated, checkAccountSetupForAnnouncements, announcementRoutes);

export default router; 