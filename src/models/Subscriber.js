import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required']
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
subscriberSchema.index({ customer: 1 });

export default mongoose.model('Subscriber', subscriberSchema); 