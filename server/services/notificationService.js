const Notification = require('../models/Notification');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const moment = require('moment');

const sendEventReminders = async () => {
  try {
    const now = moment();
    const tenMinutesFromNow = moment().add(10, 'minutes');
    
    // Find events starting in the next 10 minutes
    const upcomingEvents = await Event.find({
      status: 'upcoming',
      startTime: {
        $gte: now.toDate(),
        $lte: tenMinutesFromNow.toDate()
      }
    });
    
    for (const event of upcomingEvents) {
      // Get all active bookings for this event
      const bookings = await Booking.find({
        eventId: event._id,
        status: 'active'
      });
      
      // Create reminder notifications for each attendee
      for (const booking of bookings) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          userId: booking.attendeeId,
          eventId: event._id,
          type: 'reminder'
        });
        
        if (!existingNotification) {
          await Notification.createEventReminder(
            booking.attendeeId,
            event._id,
            event.title
          );
        }
      }
    }
    
    console.log(`Sent ${upcomingEvents.length} event reminders`);
  } catch (error) {
    console.error('Error sending event reminders:', error);
  }
};

const createBookingNotification = async (userId, eventId, eventTitle) => {
  try {
    await Notification.createBookingNotification(userId, eventId, eventTitle);
  } catch (error) {
    console.error('Error creating booking notification:', error);
  }
};

const createCancellationNotification = async (userId, eventId, eventTitle) => {
  try {
    await Notification.createCancellationNotification(userId, eventId, eventTitle);
  } catch (error) {
    console.error('Error creating cancellation notification:', error);
  }
};

const createFeedbackNotification = async (eventId, eventTitle, userRole) => {
  try {
    await Notification.createFeedbackNotification(eventId, eventTitle, userRole);
  } catch (error) {
    console.error('Error creating feedback notification:', error);
  }
};

const createIssueNotification = async (eventId, eventTitle) => {
  try {
    await Notification.createIssueNotification(eventId, eventTitle);
  } catch (error) {
    console.error('Error creating issue notification:', error);
  }
};

module.exports = {
  sendEventReminders,
  createBookingNotification,
  createCancellationNotification,
  createFeedbackNotification,
  createIssueNotification
}; 