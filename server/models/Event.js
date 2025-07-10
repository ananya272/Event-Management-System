const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  feedbackEnabled: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalFeedback: {
    type: Number,
    default: 0
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
eventSchema.index({ startTime: 1, status: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ status: 1 });

// Virtual for current bookings count
eventSchema.virtual('currentBookings').get(function() {
  return this.model('Booking').countDocuments({ 
    eventId: this._id, 
    status: 'active' 
  });
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.currentBookings;
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
  return this.currentBookings >= this.capacity;
};

// Method to check if event is ongoing
eventSchema.methods.isOngoing = function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
};

// Method to check if event has ended
eventSchema.methods.hasEnded = function() {
  const now = new Date();
  return now > this.endTime;
};

// Method to check if event is upcoming
eventSchema.methods.isUpcoming = function() {
  const now = new Date();
  return now < this.startTime;
};

// Method to update average rating
eventSchema.methods.updateAverageRating = async function() {
  const Feedback = mongoose.model('Feedback');
  const feedbacks = await Feedback.find({ 
    eventId: this._id, 
    type: 'feedback' 
  });
  
  if (feedbacks.length > 0) {
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    this.averageRating = totalRating / feedbacks.length;
    this.totalFeedback = feedbacks.length;
  } else {
    this.averageRating = 0;
    this.totalFeedback = 0;
  }
  
  return await this.save();
};

// Pre-save middleware to validate times
eventSchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    return next(new Error('End time must be after start time'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema); 