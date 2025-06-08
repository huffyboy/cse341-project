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

// Check if model exists before creating
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber; 