import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Customer from '../models/Customer.js';
import dotenv from 'dotenv';

dotenv.config();

// Google Strategy for Signup
passport.use('google-signup', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      const existingUser = await Customer.findOne({
        'oauth_providers.provider': 'google',
        'oauth_providers.provider_id': profile.id
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with this email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingEmailUser = await Customer.findOne({ email });
        if (existingEmailUser) {
          return done(null, existingEmailUser);
        }
      }

      // Create new user
      const newUser = await Customer.create({
        email: email || `${profile.id}@google.com`,
        org_name: profile.displayName,
        oauth_providers: [{
          provider: 'google',
          provider_id: profile.id,
          display_name: profile.displayName,
          email: email,
          profile_url: profile.photos?.[0]?.value
        }]
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

// Google Strategy for Connecting Accounts
passport.use('google-connect', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true  // This allows us to access req in the callback
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const customerId = req.session.connectCustomerId;
      if (!customerId) {
        return done(new Error('No customer ID found in session'));
      }

      // Check if this Google account is already connected to any account
      const existingConnection = await Customer.findOne({
        'oauth_providers.provider': 'google',
        'oauth_providers.provider_id': profile.id
      });

      if (existingConnection) {
        return done(new Error('This Google account is already connected to another account'));
      }

      // Add Google provider to existing account
      const customer = await Customer.findOneAndUpdate(
        { _id: customerId },
        { 
          $addToSet: { 
            oauth_providers: {
              provider: 'google',
              provider_id: profile.id,
              display_name: profile.displayName,
              email: profile.emails?.[0]?.value,
              profile_url: profile.photos?.[0]?.value
            }
          }
        },
        { 
          new: true,
          runValidators: false
        }
      );

      if (!customer) {
        return done(new Error('Customer not found'));
      }

      return done(null, customer);
    } catch (error) {
      return done(error);
    }
  }
));

// GitHub Strategy for Signup
passport.use('github-signup', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this GitHub ID
      const existingUser = await Customer.findOne({
        'oauth_providers.provider': 'github',
        'oauth_providers.provider_id': profile.id
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with this email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingEmailUser = await Customer.findOne({ email });
        if (existingEmailUser) {
          return done(null, existingEmailUser);
        }
      }

      // Create new user
      const newUser = await Customer.create({
        email: email || `${profile.id}@github.com`,
        org_name: profile.displayName || profile.username,
        oauth_providers: [{
          provider: 'github',
          provider_id: profile.id,
          display_name: profile.displayName || profile.username,
          email: email,
          profile_url: profile.photos?.[0]?.value
        }]
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

// GitHub Strategy for Connecting Accounts
passport.use('github-connect', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const customerId = req.session.connectCustomerId;
      if (!customerId) {
        return done(new Error('No customer ID found in session'));
      }

      // Check if this GitHub account is already connected to any account
      const existingConnection = await Customer.findOne({
        'oauth_providers.provider': 'github',
        'oauth_providers.provider_id': profile.id
      });

      if (existingConnection) {
        return done(new Error('This GitHub account is already connected to another account'));
      }

      // Add GitHub provider to existing account
      const customer = await Customer.findOneAndUpdate(
        { _id: customerId },
        { 
          $addToSet: { 
            oauth_providers: {
              provider: 'github',
              provider_id: profile.id,
              display_name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value,
              profile_url: profile.photos?.[0]?.value
            }
          }
        },
        { 
          new: true,
          runValidators: false
        }
      );

      if (!customer) {
        return done(new Error('Customer not found'));
      }

      return done(null, customer);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Customer.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 