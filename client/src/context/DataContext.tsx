import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Booking, Feedback, Notification, User } from '../types';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

// API response types are now defined in the api.ts file

interface DataContextType {
  events: Event[];
  bookings: Booking[];
  feedback: Feedback[];
  notifications: Notification[];
  organizers: User[];
  loading: {
    events: boolean;
    bookings: boolean;
    feedback: boolean;
    notifications: boolean;
    organizers: boolean;
    users: boolean;
  };
  error: string | null;
  createEvent: (event: Omit<Event, 'id'>) => Promise<boolean>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<boolean>;
  cancelBooking: (id: string) => Promise<boolean>;
  submitFeedback: (feedback: Omit<Feedback, 'id'>) => Promise<boolean>;
  markEventComplete: (eventId: string, status: 'completed' | 'issue', feedback?: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  fetchAllEvents: () => Promise<Event[]>;
  fetchAllUsers: () => Promise<User[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [organizers, setOrganizers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    events: false,
    bookings: false,
    feedback: false,
    notifications: false,
    organizers: false,
    users: false,
  });
  const [error, setError] = useState<string | null>(null);



  // Load organizers (for admin)
  const loadOrganizers = async () => {
    if (user?.role !== 'admin') return;
    
    setLoading(prev => ({ ...prev, organizers: true }));
    try {
      const response = await apiService.getOrganizers();
      if (response && response.success && response.data?.organizers) {
        // Transform MongoDB _id to id for client-side consistency
        const transformedOrganizers = response.data.organizers.map((org: any) => ({
          id: org._id,
          name: org.name,
          email: org.email,
          role: org.role,
          createdAt: new Date(org.createdAt),
          cancelledBookings: org.cancelledBookings,
          isBlocked: org.isBlocked
        }));
        setOrganizers(transformedOrganizers);
      }
    } catch (error: any) {
      console.error('Load organizers error:', error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, organizers: false }));
    }
  };

  // Create event
  const createEvent = async (eventData: Omit<Event, 'id'>): Promise<boolean> => {
    try {
      // Helper function to ensure we have a valid Date object
      const ensureDate = (date: string | Date): Date => {
        if (date instanceof Date) {
          return date;
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Invalid date format: ${date}`);
        }
        return parsedDate;
      };

      // Convert to Date objects if they're strings
      const startTime = ensureDate(eventData.startTime);
      const endTime = ensureDate(eventData.endTime);

      // Ensure organizerId is set for non-admin users
      const organizerId = user?.role !== 'admin' && !eventData.organizerId ? user?.id : eventData.organizerId;
      
      if (!organizerId) {
        setError('Organizer ID is required.');
        return false;
      }
      
      if (endTime <= startTime) {
        setError('End time must be after start time');
        return false;
      }
      
      const formattedEvent = {
        title: eventData.title,
        description: eventData.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: eventData.location,
        capacity: eventData.capacity,
        organizerId,
        status: 'upcoming' as const,
        feedbackEnabled: eventData.feedbackEnabled || false,
      };
      
      console.log('Sending event data to API:', formattedEvent);
      
      const response = await apiService.createEvent(formattedEvent);
      console.log('API Response:', response);
      
      if (response?.success) {
        console.log('Event created successfully');
        // Refresh the events list
        await loadEvents();
        return true;
      } else {
        const errorMsg = response?.message || 'Failed to create event. Please check the form data and try again.';
        console.error('API Error:', errorMsg);
        setError(errorMsg);
        return false;
      }
    } catch (error: any) {
      console.error('DataContext createEvent - error:', error);
      setError(error.message);
      return false;
    }
  };

  // Load events
  const loadEvents = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const response = await apiService.getEvents();
      if (response.success && response.data?.events) {
        // Transform date strings to Date objects and validate them
        const transformedEvents = response.data.events
          .map((event: any) => {
            try {
              // Convert date strings to Date objects
              const startTime = new Date(event.startTime);
              const endTime = new Date(event.endTime);
              
              // Validate the dates
              if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                console.error('Invalid date for event:', event._id);
                return null;
              }
              
              // Extract organizerId and createdBy, handling both object and string cases
              const organizerId = event.organizerId?._id || event.organizerId;
              const createdBy = event.createdBy?._id || event.createdBy;
              
              const transformedEvent = {
                ...event,
                id: event._id, // Map MongoDB _id to id
                organizerId,
                createdBy,
                startTime,
                endTime,
                createdAt: event.createdAt ? new Date(event.createdAt) : undefined
              };
              
              console.log('Transformed event:', {
                ...transformedEvent,
                organizerId: typeof organizerId === 'object' ? organizerId._id : organizerId,
                createdBy: typeof createdBy === 'object' ? createdBy._id : createdBy
              });
              
              return transformedEvent;
            } catch (dateError) {
              console.error('Error parsing date for event:', event.id, dateError);
              return null;
            }
          })
          .filter(Boolean); // Remove any null events
        
        setEvents(transformedEvents);
      }
    } catch (error: any) {
      console.error('Load events error:', error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Load bookings
  const loadBookings = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const response = await apiService.getBookings();
      console.log('Bookings API response:', response); // Debug log
      
      if (response?.success && response.data?.bookings) {
        // Transform the bookings data to match our frontend format
        const transformedBookings = response.data.bookings.map((booking: any) => ({
          id: booking._id || booking.id,
          eventId: booking.eventId?._id || booking.eventId,
          attendeeId: booking.attendeeId?._id || booking.attendeeId,
          attendeeName: booking.attendeeName || 'Unknown',
          attendeeEmail: booking.attendeeEmail || '',
          attendeePhone: booking.attendeePhone || '',
          bookedAt: booking.bookedAt ? new Date(booking.bookedAt) : new Date(),
          status: booking.status || 'active'
        }));
        
        console.log('Transformed bookings:', transformedBookings); // Debug log
        setBookings(transformedBookings);
      }
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      setError(error.message || 'Failed to load bookings');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  // Load feedback
  const loadFeedback = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, feedback: true }));
    try {
      const response = await apiService.getFeedback();
      if (response.success && response.data?.feedback) {
        setFeedback(response.data.feedback);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, feedback: false }));
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, notifications: true }));
    try {
      const response = await apiService.getNotifications();
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const fetchAllEvents = async (): Promise<Event[]> => {
    if (user?.role !== 'admin') return [];
    
    try {
      const response = await apiService.get<{events: Event[]}>('/events');
      return response.events || [];
    } catch (error) {
      setError('Failed to fetch all events');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const fetchAllUsers = async (): Promise<User[]> => {
    if (user?.role !== 'admin') {
      console.log('Access denied: User is not an admin');
      return [];
    }
    
    setLoading(prev => ({ ...prev, users: true }));
    setError(null);
    
    try {
      console.log('Fetching all users...');
      const response = await apiService.getAllUsers();
      console.log('Users API response:', response);
      
      if (response?.success && response.data?.users) {
        const users = response.data.users.map(user => ({
          id: user._id || user.id,
          name: user.name || 'Unknown User',
          email: user.email || '',
          role: user.role || 'attendee',
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          cancelledBookings: user.cancelledBookings || 0,
          isBlocked: user.isBlocked || false,
        }));
        console.log(`Fetched ${users.length} users`);
        return users;
      }
      return [];
    } catch (err) {
      console.error('Error fetching all users:', err);
      setError('Failed to fetch users');
      return [];
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Refresh all data
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setEvents([]);
      setBookings([]);
      setFeedback([]);
      setNotifications([]);
      setOrganizers([]);
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    try {
      // Only load data relevant to the user's role
      if (user.role === 'admin') {
        await Promise.all([
          loadEvents(),
          loadBookings(),
          loadFeedback(),
          loadNotifications(),
          loadOrganizers(),
          fetchAllUsers()
        ]);
      } else if (user.role === 'organizer') {
        await Promise.all([
          loadEvents(),
          loadBookings(),
          loadFeedback(),
          loadNotifications(),
        ]);
      } else {
        // Attendee
        await Promise.all([
          loadEvents(),
          loadBookings(),
          loadNotifications(),
        ]);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setEvents([]);
      setBookings([]);
      setFeedback([]);
      setNotifications([]);
      setOrganizers([]);
    }
  }, [user]);

  // Update event
  const updateEvent = async (id: string, updates: Partial<Event>): Promise<boolean> => {
    try {
      const updateData: any = { ...updates };
      if (updates.startTime) updateData.startTime = new Date(updates.startTime).toISOString();
      if (updates.endTime) updateData.endTime = new Date(updates.endTime).toISOString();

      const response = await apiService.updateEvent(id, updateData);
      if (response.success) {
        await loadEvents();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  // Delete event
  const deleteEvent = async (id: string): Promise<boolean> => {
    console.log('DataContext deleteEvent - id:', id); // Debug log
    try {
      if (!id) {
        console.error('DataContext deleteEvent - Invalid event ID');
        setError('Invalid event ID');
        return false;
      }
      const response = await apiService.deleteEvent(id);
      console.log('DataContext deleteEvent - response:', response); // Debug log
      if (response.success) {
        await loadEvents();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('DataContext deleteEvent - error:', error); // Debug log
      setError(error.message);
      return false;
    }
  };

  // Create booking
  const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<boolean> => {
    try {
      if (!user?.id) {
        setError('User not authenticated');
        return false;
      }
      
      console.log('Creating booking with data:', bookingData); // Debug log
      
      // Create the booking with all required fields
      const bookingToCreate = {
        ...bookingData,
        attendeeId: user.id,
        bookedAt: new Date().toISOString(),
        status: 'active' as const
      };
      
      console.log('Sending booking to API:', bookingToCreate);
      
      const response = await apiService.createBooking(bookingToCreate);
      console.log('Booking API response:', response); // Debug log

      if (response?.success && response.data?.booking) {
        // Transform the API response to match our Booking type
        const newBooking: Booking = {
          id: response.data.booking._id || response.data.booking.id,
          eventId: response.data.booking.eventId,
          attendeeId: user.id,
          attendeeName: response.data.booking.attendeeName || user.name || '',
          attendeeEmail: response.data.booking.attendeeEmail || user.email || '',
          attendeePhone: response.data.booking.attendeePhone || '',
          bookedAt: new Date(response.data.booking.bookedAt || new Date()),
          status: 'active'
        };
        
        // Update the local state
        setBookings(prevBookings => [...prevBookings, newBooking]);
        
        // Also update the events to mark this event as booked
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === bookingData.eventId 
              ? { ...event, isBooked: true }
              : event
          )
        );
        
        console.log('Successfully created booking:', newBooking);
        return true;
      }
      
      setError(response?.message || 'Failed to create booking');
      return false;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
      return false;
    }
  };

  // Submit feedback
  const submitFeedback = async (feedbackData: Omit<Feedback, 'id'>): Promise<boolean> => {
    try {
      // Create a type-safe feedback object that matches the API expectations
      const feedbackPayload: any = {
        eventId: feedbackData.eventId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        type: feedbackData.type,
      };
      
      // Add optional fields only if they exist
      if ('userId' in feedbackData) {
        feedbackPayload.userId = feedbackData.userId;
      }
      if ('userRole' in feedbackData) {
        feedbackPayload.userRole = feedbackData.userRole;
      }
      
      const response = await apiService.submitFeedback(feedbackPayload);
      
      if (response && response.success) {
        await loadFeedback();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
      return false;
    }
  };

  // Cancel booking
  const cancelBooking = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.cancelBooking(id);
      if (response.success) {
        await loadBookings();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      setError(error.message || 'Failed to cancel booking');
      return false;
    }
  };

  // Mark event complete
  const markEventComplete = async (eventId: string, status: 'completed' | 'issue', feedbackText?: string): Promise<boolean> => {
    try {
      const response = await apiService.markEventComplete(eventId, {
        status,
        feedback: feedbackText,
      });

      if (response.success) {
        await loadEvents();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  // Mark notification as read
  const markNotificationRead = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.markNotificationRead(id);
      if (response.success) {
        await loadNotifications();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  return (
    <DataContext.Provider value={{
      events,
      bookings,
      feedback,
      notifications,
      organizers,
      loading,
      error,
      createEvent,
      updateEvent,
      deleteEvent,
      createBooking,
      cancelBooking,
      submitFeedback,
      markEventComplete,
      markNotificationRead,
      refreshData,
      fetchAllEvents,
      fetchAllUsers,
    }}>
      {children}
    </DataContext.Provider>
  );
};