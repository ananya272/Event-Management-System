import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Calendar, MapPin, Clock, Star, Bell, AlertTriangle } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from '../types';

const AttendeePanel: React.FC = () => {
  const { user } = useAuth();
  const { events, bookings, createBooking, cancelBooking, submitFeedback, notifications } = useData();
  const [bookingModal, setBookingModal] = useState<Event | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<Event | null>(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: '',
  });

  // Debug logs
  console.log('All bookings:', bookings);
  console.log('Current user ID:', user?.id);
  
  const userBookings = bookings.filter(booking => {
    console.log('Booking:', booking);
    return booking.attendeeId === user?.id;
  });
  
  console.log('User bookings:', userBookings);
  
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const bookedEvents = userBookings.filter(booking => {
    console.log('Booking status check:', booking.id, booking.status);
    return booking.status === 'active';
  });
  
  console.log('Active bookings:', bookedEvents);
  
  const cancelledBookings = userBookings.filter(booking => booking.status === 'cancelled').length;
  const isBlocked = cancelledBookings >= 2;

  const userNotifications = notifications.filter(notif => notif.userId === user?.id && !notif.read);

  // Helper functions for date/time formatting
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: string | Date): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    // Check for events starting soon
    const checkUpcomingEvents = () => {
      const now = new Date();
      bookedEvents.forEach(booking => {
        const event = events.find(e => e.id === booking.eventId);
        if (event) {
          const startTime = new Date(event.startTime);
          const timeDiff = startTime.getTime() - now.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          
          if (minutesDiff === 10) {
            // This would trigger a notification in a real app
            console.log(`Event "${event.title}" starts in 10 minutes!`);
          }
        }
      });
    };

    const interval = setInterval(checkUpcomingEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [bookedEvents, events]);

  const handleBookEvent = (event: Event) => {
    if (isBlocked) {
      alert('You are blocked from booking events due to multiple cancellations.');
      return;
    }
    setBookingModal(event);
    setBookingData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
    });
  };

  const handleSubmitBooking = async () => {
    if (!bookingModal || !bookingData.name || !bookingData.email || !bookingData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const now = new Date();
      const success = await createBooking({
        eventId: bookingModal.id,
        attendeeId: user?.id || '',
        attendeeName: bookingData.name,
        attendeeEmail: bookingData.email,
        attendeePhone: bookingData.phone,
        status: 'active',
        bookedAt: now
      });
      
      if (success) {
        alert('Booking created successfully!');
        setBookingModal(null);
        setBookingData({ name: '', email: '', phone: '' });
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating the booking.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking.');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackModal || !feedbackData.comment.trim()) {
      alert('Please provide your feedback');
      return;
    }
    
    try {
      const now = new Date();
      const success = await submitFeedback({
        eventId: feedbackModal.id,
        userId: user?.id || '',
        userRole: 'attendee',
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        type: 'feedback',
        submittedAt: now
      });
      
      if (success) {
        alert('Thank you for your feedback!');
        setFeedbackModal(null);
        setFeedbackData({ rating: 5, comment: '' });
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendee Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Notifications */}
      {userNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Notifications</h3>
          </div>
          <div className="space-y-2">
            {userNotifications.map((notif) => (
              <p key={notif.id} className="text-sm text-blue-800">{notif.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Blocked Warning */}
      {isBlocked && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">
              You are blocked from booking events due to multiple cancellations.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{bookedEvents.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{cancelledBookings}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Events</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h3>
        {bookedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookedEvents.map((booking) => {
              const event = events.find(e => e.id === booking.eventId);
              if (!event) return null;
              
              return (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {event.status === 'completed' && (
                      <button
                        onClick={() => setFeedbackModal(event)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Give Feedback
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Events */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBook={handleBookEvent}
              userRole="attendee"
            />
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Event</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setBookingModal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={feedbackData.comment}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setFeedbackModal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackData.comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeePanel;