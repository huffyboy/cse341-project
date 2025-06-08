import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  index as getDashboard,
  account as getAccount,
  updateAccount
} from '../controllers/dashboardController.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(isAuthenticated);

// Main dashboard
router.get('/', getDashboard);

// Account management
router.get('/account', getAccount);
router.put('/account', updateAccount);

export default router; 