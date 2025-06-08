import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: function() {
      return this.account_setup_completed;
    },
    trim: true
  },
  org_handle: {
    type: String,
    required: function() {
      return this.account_setup_completed;
    },
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+$/, 'Handle can only contain lowercase letters and numbers'],
    minlength: [3, 'Handle must be at least 3 characters long'],
    maxlength: [20, 'Handle cannot exceed 20 characters']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    sparse: true // Allow null/undefined values
  },
  marketing_consent: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  account_phone_number: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  // OAuth related fields
  oauth_providers: [{
    provider: {
      type: String,
      enum: ['google', 'github'],
      required: true
    },
    provider_id: {
      type: String,
      required: true
    },
    email: String,
    name: String,
    picture: String
  }],
  account_setup_completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for OAuth providers
customerSchema.index({ 'oauth_providers.provider': 1, 'oauth_providers.provider_id': 1 }, { unique: true });

// Pre-save middleware to ensure handle is URL and SMS friendly
customerSchema.pre('save', function(next) {
  if (this.isModified('org_handle')) {
    // Remove any special characters and convert to lowercase
    this.org_handle = this.org_handle.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  next();
});

// Virtual for SMS subscription command
customerSchema.virtual('sms_subscription_command').get(function() {
  return `follow ${this.org_handle}`;
});

export default mongoose.model('Customer', customerSchema); 