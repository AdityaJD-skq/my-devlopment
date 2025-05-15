import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      // Authentication actions
      'login', 'logout', 'signup', 'password_reset',
      
      // User management actions
      'user_created', 'user_updated', 'user_deleted', 'role_changed', 'status_changed',
      
      // Content actions
      'test_started', 'test_submitted', 'question_added', 'question_updated', 'question_deleted',
      
      // Educational actions
      'chapter_viewed', 'chapter_completed', 'progress_updated'
    ]
  },
  details: { 
    type: Object,
    default: {} 
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for faster querying
activityLogSchema.index({ userId: 1, type: 1, timestamp: -1 });
activityLogSchema.index({ type: 1, timestamp: -1 });

export default mongoose.model('ActivityLog', activityLogSchema); 