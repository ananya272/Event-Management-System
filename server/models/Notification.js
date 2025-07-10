const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['reminder', 'booking', 'cancellation', 'feedback', 'issue'],
    required: [true, 'Notification type is required']
  },
  read: {
    type: Boolean,
    default: false
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
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ eventId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.updatedAt = new Date();
  return await this.save();
};

// Static method to get unread notifications count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, read: false });
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { userId, read: false },
    { read: true, updatedAt: new Date() }
  );
};

// Static method to get notifications for a user with pagination
notificationSchema.statics.getUserNotifications = async function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const notifications = await this.find({ userId })
    .populate('eventId', 'title startTime endTime')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments({ userId });
  
  return {
    notifications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
};

// Static method to create event reminder notification
notificationSchema.statics.createEventReminder = async function(userId, eventId, eventTitle) {
  return await this.create({
    userId,
    eventId,
    message: `Reminder: Your event "${eventTitle}" starts in 10 minutes!`,
    type: 'reminder'
  });
};

// Static method to create booking confirmation notification
notificationSchema.statics.createBookingNotification = async function(userId, eventId, eventTitle) {
  return await this.create({
    userId,
    eventId,
    message: `Booking confirmed for "${eventTitle}"`,
    type: 'booking'
  });
};

// Static method to create cancellation notification
notificationSchema.statics.createCancellationNotification = async function(userId, eventId, eventTitle) {
  return await this.create({
    userId,
    eventId,
    message: `Booking cancelled for "${eventTitle}"`,
    type: 'cancellation'
  });
};

// Static method to create feedback notification for admin
notificationSchema.statics.createFeedbackNotification = async function(eventId, eventTitle, userRole) {
  const User = mongoose.model('User');
  const admins = await User.find({ role: 'admin' });
  
  const notifications = admins.map(admin => ({
    userId: admin._id,
    eventId,
    message: `New ${userRole} feedback received for "${eventTitle}"`,
    type: 'feedback'
  }));
  
  return await this.insertMany(notifications);
};

// Static method to create issue notification for admin
notificationSchema.statics.createIssueNotification = async function(eventId, eventTitle) {
  const User = mongoose.model('User');
  const admins = await User.find({ role: 'admin' });
  
  const notifications = admins.map(admin => ({
    userId: admin._id,
    eventId,
    message: `Issue reported for "${eventTitle}"`,
    type: 'issue'
  }));
  
  return await this.insertMany(notifications);
};

module.exports = mongoose.model('Notification', notificationSchema); 