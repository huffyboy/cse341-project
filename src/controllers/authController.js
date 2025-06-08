import Customer from '../models/Customer.js';

// Get login page
export const getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.account_setup_completed) {
      return res.redirect('/dashboard');
    }
    return res.redirect('/auth/setup');
  }
  res.render('auth/login', { 
    title: 'Login',
    error: req.flash ? req.flash('error') : null
  });
};

// Get home page
export const getHomePage = (req, res) => {
  res.render('auth/home', { user: req.user });
};

// Logout
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
};

// Get profile completion form
export const getCompleteProfileForm = (req, res) => {
  res.render('auth/complete-profile', { user: req.user });
};

// Get setup page
export const getSetup = (req, res) => {
  console.log('getSetup called. User:', req.user ? 'exists' : 'not found');
  console.log('Session:', req.session);
  
  if (!req.isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return res.redirect('/auth/login');
  }
  
  if (req.user.account_setup_completed) {
    console.log('Account setup already completed, redirecting to dashboard');
    return res.redirect('/dashboard');
  }

  console.log('Rendering setup page');
  res.render('auth/setup', {
    title: 'Complete Your Profile',
    error: req.flash('error'),
    formData: req.flash('formData')[0] || {},
    user: req.user
  });
};

// Complete profile
export const completeProfile = async (req, res) => {
  try {
    const {
      username,
      org_name,
      org_handle,
      email,
      phone,
      timezone,
      marketing_consent
    } = req.body;

    // Check if username or org_handle is already taken
    const existingUser = await Customer.findOne({
      $or: [
        { username },
        { org_handle }
      ],
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.render('auth/complete-profile', {
        user: req.user,
        formData: req.body,
        error: 'Username or organization handle is already taken'
      });
    }

    // Update user profile
    const updatedUser = await Customer.findByIdAndUpdate(
      req.user._id,
      {
        username,
        org_name,
        org_handle,
        email: email || undefined,
        phone: phone || undefined,
        timezone,
        marketing_consent: marketing_consent === 'on',
        account_setup_completed: true
      },
      { new: true }
    );

    // Update session user
    req.user = updatedUser;
    
    res.redirect('/auth/home');
  } catch (error) {
    console.error('Error completing profile:', error);
    res.render('auth/complete-profile', {
      user: req.user,
      formData: req.body,
      error: 'Failed to update profile. Please try again.'
    });
  }
};

// Handle setup form submission
export const postSetup = async (req, res) => {
  try {
    const { org_name, org_handle, email, phone, timezone, marketing_consent } = req.body;

    // Validate required fields
    if (!org_name || !org_handle) {
      req.flash('error', 'Organization name and handle are required');
      req.flash('formData', req.body);
      return res.redirect('/auth/setup');
    }

    // Check if org_handle is already taken
    const existingUser = await Customer.findOne({
      org_handle,
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      req.flash('error', 'Organization handle is already taken');
      req.flash('formData', req.body);
      return res.redirect('/auth/setup');
    }

    // Update user profile
    const user = await Customer.findByIdAndUpdate(
      req.user._id,
      {
        org_name,
        org_handle,
        email: email || req.user.email, // Keep existing email if not provided
        phone,
        timezone: timezone || 'UTC',
        marketing_consent: marketing_consent === 'on',
        account_setup_completed: true
      },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Update session user
    req.user = user;

    req.flash('success', 'Profile completed successfully!');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Setup error:', error);
    req.flash('error', 'Failed to complete profile setup. Please try again.');
    req.flash('formData', req.body);
    res.redirect('/auth/setup');
  }
};

// Connect OAuth provider
export const connectOAuth = async (req, res) => {
  const { provider } = req.params;
  
  if (!['google', 'github'].includes(provider)) {
    req.flash('error', 'Invalid OAuth provider');
    return res.redirect('/dashboard/account');
  }

  try {
    // Create a pending OAuth connection
    await PendingOAuth.create({
      provider,
      customer_id: req.user._id
    });

    // Redirect to the OAuth provider
    res.redirect(`/auth/${provider}`);
  } catch (error) {
    req.flash('error', 'Failed to initiate OAuth connection');
    res.redirect('/dashboard/account');
  }
}; 