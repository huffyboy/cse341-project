/**
 * Middleware to check if user is authenticated
 * Redirects to login page if not authenticated
 * Redirects to setup page if authenticated but setup not completed
 */
export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  
  if (!req.user.account_setup_completed) {
    return res.redirect('/auth/setup');
  }
  
  next();
};

/**
 * Middleware to check if user is authenticated for API routes
 * Returns 401 status if not authenticated
 */
export const isAuthenticatedApi = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: {
      status: 401,
      message: 'Authentication required',
      type: 'AuthenticationError'
    }
  });
};

/**
 * Middleware to check if user profile is completed
 * Redirects to profile completion page if not completed
 */
export const isProfileCompleted = (req, res, next) => {
  if (req.isAuthenticated() && req.user.profile_completed) {
    return next();
  }
  res.redirect('/auth/complete-profile');
}; 