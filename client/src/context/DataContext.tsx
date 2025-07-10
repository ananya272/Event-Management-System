import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Booking, Feedback, Notification, User } from '../types';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

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
  });
  const [error, setError] = useState<string | null>(null);

  // Load organizers (for admin)
  const loadOrganizers = async () => {
    if (user?.role !== 'admin') return;
    
    setLoading(prev => ({ ...prev, organizers: true }));
    try {
      const response = await apiService.getOrganizers();
      if (response.success && response.data?.organizers) {
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
      // Debug: Log the event data being sent
      console.log('DataContext createEvent - eventData:', eventData);
      
      // Ensure dates are properly formatted for ISO8601
      const startTime = new Date(eventData.startTime);
      const endTime = new Date(eventData.endTime);
      
      // Validate that the dates are valid
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        setError('Invalid date format');
        return false;
      }

      // Validate organizerId
      if (!eventData.organizerId) {
        setError('Valid organizer ID is required');
        return false;
      }

      // Find the organizer to ensure it exists
      const organizerExists = organizers.some(org => org.id === eventData.organizerId);
      if (!organizerExists) {
        setError('Invalid organizer ID');
        return false;
      }
      
      const apiData = {
        title: eventData.title,
        description: eventData.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: eventData.location,
        capacity: eventData.capacity,
        organizerId: eventData.organizerId,
      };
      
      console.log('DataContext createEvent - API data:', apiData);
      
      const response = await apiService.createEvent(apiData);
      
      console.log('DataContext createEvent - response:', response);

      if (response.success) {
        await loadEvents();
        return true;
      }
      return false;
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
      if (response.success && response.data?.bookings) {
        setBookings(response.data.bookings);
      }
    } catch (error: any) {
      setError(error.message);
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
    setError(null);
    try {
      const loadPromises = [
        loadEvents(),
        loadBookings(),
        loadFeedback(),
        loadNotifications(),
      ];
      
      // Only load organizers if user is admin
      if (user?.role === 'admin') {
        loadPromises.push(loadOrganizers());
      }
      
      await Promise.all(loadPromises);
    } catch (error: any) {
      setError(error.message);
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
      if (updates.startTime) updateData.startTime = updates.startTime.toISOString();
      if (updates.endTime) updateData.endTime = updates.endTime.toISOString();

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
      const response = await apiService.createBooking({
        eventId: bookingData.eventId,
        attendeeName: bookingData.attendeeName,
        attendeeEmail: bookingData.attendeeEmail,
        attendeePhone: bookingData.attendeePhone,
      });

      if (response.success) {
        await loadBookings();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
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
      setError(error.message);
      return false;
    }
  };

  // Submit feedback
  const submitFeedback = async (feedbackData: Omit<Feedback, 'id'>): Promise<boolean> => {
    try {
      const response = await apiService.submitFeedback({
        eventId: feedbackData.eventId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        type: feedbackData.type,
      });

      if (response.success) {
        await loadFeedback();
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message);
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
    }}>
      {children}
    </DataContext.Provider>
  );
};