import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getLogin,
  getSetup,
  postSetup,
  logout,
  connectOAuth
} from '../controllers/authController.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Custom middleware for setup routes - only checks authentication
const isAuthenticatedForSetup = (req, res, next) => {
  console.log('isAuthenticatedForSetup middleware - User:', req.user ? 'exists' : 'not found');
  console.log('isAuthenticatedForSetup middleware - Session:', req.session);
  console.log('isAuthenticatedForSetup middleware - isAuthenticated:', req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    console.log('isAuthenticatedForSetup middleware - Not authenticated, redirecting to login');
    return res.redirect('/auth/login');
  }
  console.log('isAuthenticatedForSetup middleware - Authentication successful, proceeding to next middleware');
  next();
};

// Login routes
router.get('/login', getLogin);

// GitHub OAuth routes
router.get('/github',
  (req, res, next) => {
    // Store the return URL in the session
    req.session.returnTo = req.query.returnTo || '/dashboard';
    console.log('GitHub auth URL:', process.env.NODE_ENV === 'production' 
      ? `${process.env.URL}/auth/github/callback`
      : '/auth/github/callback');
    passport.authenticate('github-signup', { 
      scope: ['user:email'],
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  }
);

router.get('/github/callback',
  (req, res, next) => {
    // Check if this is a connect flow
    if (req.session.connectCustomerId) {
      passport.authenticate('github-connect', {
        failureRedirect: '/dashboard/account',
        failureFlash: true
      })(req, res, next);
    } else {
      console.log('Starting GitHub signup authentication...');
      passport.authenticate('github-signup', {
        failureRedirect: '/auth/login',
        failureFlash: true
      })(req, res, next);
    }
  },
  (req, res) => {
    console.log('GitHub callback completed. User:', req.user ? 'exists' : 'not found');
    console.log('Session:', req.session);
    
    // If this was a connect flow
    if (req.session.connectCustomerId) {
      delete req.session.connectCustomerId;
      req.flash('success', 'GitHub account connected successfully');
      return res.redirect('/dashboard/account');
    }

    // Otherwise it was a signup flow
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    
    if (!req.user.account_setup_completed) {
      console.log('Redirecting to setup page...');
      return res.redirect('/auth/setup');
    }
    
    res.redirect(returnTo);
  }
);

// GitHub Connect route
router.get('/connect/github',
  isAuthenticated,
  (req, res, next) => {
    // Store the current user's ID in the session
    req.session.connectCustomerId = req.user._id;
    next();
  },
  passport.authenticate('github-connect', { scope: ['user:email'] })
);

// Google OAuth routes
router.get('/google',
  (req, res, next) => {
    // Store the return URL in the session
    req.session.returnTo = req.query.returnTo || '/dashboard';
    passport.authenticate('google-signup', { 
      scope: ['profile', 'email'],
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  }
);

router.get('/google/callback',
  (req, res, next) => {
    // Check if this is a connect flow
    if (req.session.connectCustomerId) {
      passport.authenticate('google-connect', {
        failureRedirect: '/dashboard/account',
        failureFlash: true
      })(req, res, next);
    } else {
      passport.authenticate('google-signup', {
        failureRedirect: '/auth/login',
        failureFlash: true
      })(req, res, next);
    }
  },
  (req, res) => {
    // If this was a connect flow
    if (req.session.connectCustomerId) {
      delete req.session.connectCustomerId;
      req.flash('success', 'Google account connected successfully');
      return res.redirect('/dashboard/account');
    }

    // Otherwise it was a signup flow
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    
    if (!req.user.account_setup_completed) {
      return res.redirect('/auth/setup');
    }
    
    res.redirect(returnTo);
  }
);

// Google Connect route
router.get('/connect/google',
  isAuthenticated,
  (req, res, next) => {
    // Store the current user's ID in the session
    req.session.connectCustomerId = req.user._id;
    next();
  },
  passport.authenticate('google-connect', { scope: ['profile', 'email'] })
);

// Connect OAuth provider routes
router.get('/connect/:provider', isAuthenticated, async (req, res, next) => {
    try {
        // Store the customer ID in the session
        req.session.connectCustomerId = req.user._id;
        req.session.returnTo = '/dashboard/account';
        
        // Start the OAuth flow
        passport.authenticate(req.params.provider, {
            scope: req.params.provider === 'github' ? ['user:email', 'read:user'] : ['profile', 'email']
        })(req, res, next);
    } catch (error) {
        console.error('Error starting OAuth connection:', error);
        req.flash('error', 'Failed to start OAuth connection');
        res.redirect('/dashboard/account');
    }
});

// Setup routes - use isAuthenticatedForSetup instead of isAuthenticated
router.get('/setup', isAuthenticatedForSetup, (req, res, next) => {
  console.log('Setup route accessed. User:', req.user ? 'exists' : 'not found');
  console.log('Session:', req.session);
  getSetup(req, res, next);
});
router.post('/setup', isAuthenticatedForSetup, postSetup);

// Logout - handle both GET and POST requests
router.get('/logout', logout);
router.post('/logout', logout);

// Disconnect OAuth provider
router.post('/disconnect/:provider',
  isAuthenticated,
  async (req, res) => {
    try {
      const { provider } = req.params;
      const customerId = req.user._id;

      // Check if customer has more than one provider
      const customer = await Customer.findById(customerId);
      if (customer.oauth_providers.length <= 1) {
        req.flash('error', 'Cannot disconnect your only authentication method');
        return res.redirect('/dashboard/account');
      }

      // Remove the provider using findOneAndUpdate
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customerId },
        { 
          $pull: { 
            oauth_providers: { provider } 
          }
        },
        { 
          new: true,
          runValidators: false
        }
      );

      if (!updatedCustomer) {
        throw new Error('Customer not found');
      }

      req.flash('success', `${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected successfully`);
      res.redirect('/dashboard/account');
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      req.flash('error', 'Failed to disconnect account');
      res.redirect('/dashboard/account');
    }
  }
);

export default router; 