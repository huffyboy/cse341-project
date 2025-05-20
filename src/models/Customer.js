import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  org_name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  org_handle: {
    type: String,
    required: [true, 'Organization handle is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  marketing_consent: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    unique: true,
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  account_phone_number: {
    type: String,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Customer', customerSchema); 