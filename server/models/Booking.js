const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Attendee ID is required']
  },
  attendeeName: {
    type: String,
    required: [true, 'Attendee name is required'],
    trim: true
  },
  attendeeEmail: {
    type: String,
    required: [true, 'Attendee email is required'],
    trim: true,
    lowercase: true
  },
  attendeePhone: {
    type: String,
    required: [true, 'Attendee phone is required'],
    trim: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
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
bookingSchema.index({ eventId: 1, status: 1 });
bookingSchema.index({ attendeeId: 1 });
bookingSchema.index({ status: 1 });

// Compound index to prevent duplicate bookings
bookingSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });

// Pre-save middleware to check event capacity
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('status')) {
    const Event = mongoose.model('Event');
    const event = await Event.findById(this.eventId);
    
    if (!event) {
      return next(new Error('Event not found'));
    }
    
    if (this.status === 'active') {
      const activeBookings = await this.constructor.countDocuments({
        eventId: this.eventId,
        status: 'active'
      });
      
      if (activeBookings >= event.capacity) {
        return next(new Error('Event is full'));
      }
    }
  }
  next();
});

// Method to cancel booking
bookingSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  this.updatedAt = new Date();
  return await this.save();
};

// Static method to get booking statistics
bookingSchema.statics.getBookingStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    active: 0,
    cancelled: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Booking', bookingSchema); 