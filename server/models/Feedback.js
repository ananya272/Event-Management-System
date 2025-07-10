const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userRole: {
    type: String,
    enum: ['organizer', 'attendee'],
    required: [true, 'User role is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['feedback', 'issue'],
    required: [true, 'Feedback type is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ eventId: 1, type: 1 });
feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ userRole: 1 });
feedbackSchema.index({ type: 1 });

// Compound index to prevent duplicate feedback from same user for same event
feedbackSchema.index({ eventId: 1, userId: 1, type: 1 }, { unique: true });

// Pre-save middleware to validate feedback submission
feedbackSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Event = mongoose.model('Event');
    const event = await Event.findById(this.eventId);
    
    if (!event) {
      return next(new Error('Event not found'));
    }
    
    // Check if event has ended for attendee feedback
    if (this.userRole === 'attendee') {
      const now = new Date();
      if (now < event.endTime) {
        return next(new Error('Cannot submit feedback before event ends'));
      }
    }
    
    // Check if feedback already exists for this user and event
    const existingFeedback = await this.constructor.findOne({
      eventId: this.eventId,
      userId: this.userId,
      type: this.type
    });
    
    if (existingFeedback) {
      return next(new Error('Feedback already submitted for this event'));
    }
  }
  next();
});

// Post-save middleware to update event average rating
feedbackSchema.post('save', async function() {
  if (this.type === 'feedback') {
    const Event = mongoose.model('Event');
    const event = await Event.findById(this.eventId);
    if (event) {
      await event.updateAverageRating();
    }
  }
});

// Static method to get feedback statistics for an event
feedbackSchema.statics.getFeedbackStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  
  const result = {
    feedback: { count: 0, avgRating: 0 },
    issue: { count: 0, avgRating: 0 }
  };
  
  stats.forEach(stat => {
    result[stat._id] = {
      count: stat.count,
      avgRating: Math.round(stat.avgRating * 10) / 10
    };
  });
  
  return result;
};

// Static method to get all feedback for admin dashboard
feedbackSchema.statics.getAllFeedbackForAdmin = async function() {
  return await this.find()
    .populate('eventId', 'title startTime endTime')
    .populate('userId', 'name email role')
    .sort({ submittedAt: -1 });
};

module.exports = mongoose.model('Feedback', feedbackSchema); 