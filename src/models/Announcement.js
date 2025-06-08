import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  scheduled_time: {
    type: Date,
    required: true
  },
  is_sent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Announcement', announcementSchema); 