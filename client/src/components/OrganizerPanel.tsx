import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Event, User } from '../types';
import { Calendar, MessageCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';
import EventCard from './EventCard';
import EventForm from './EventForm';

// Use the main Event type instead of a separate OrganizerEvent type
// This ensures type consistency throughout the application

const OrganizerPanel: React.FC = () => {
  const { user } = useAuth();
  const { events, markEventComplete, updateEvent, organizers: allOrganizers } = useData();
  
  // Ensure the current user is in the organizers list
  const [organizers, setOrganizers] = useState<User[]>(allOrganizers || []);
  
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id || '';
      const userName = user.name || 'You';
      const userEmail = user.email || '';
      const now = new Date();
      
      if (allOrganizers && allOrganizers.length > 0) {
        // Check if current user is already in the organizers list
        const userIsOrganizer = allOrganizers.some(org => 
          (org._id || org.id) === userId
        );
        
        if (!userIsOrganizer) {
          // Add current user to organizers list if they're not already there
          setOrganizers([
            {
              _id: userId,
              id: userId,
              name: userName,
              email: userEmail,
              role: 'organizer',
              createdAt: now,
              cancelledBookings: 0,
              isBlocked: false
            },
            ...allOrganizers
          ]);
        } else {
          setOrganizers(allOrganizers);
        }
      } else {
        // If no organizers, create a list with just the current user
        setOrganizers([{
          _id: userId,
          id: userId,
          name: userName,
          email: userEmail,
          role: 'organizer',
          createdAt: now,
          cancelledBookings: 0,
          isBlocked: false
        }]);
      }
    }
  }, [allOrganizers, user]);
  const [completionModal, setCompletionModal] = useState<{
    eventId: string;
    status: 'completed' | 'issue';
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter events for the current organizer
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    console.log('Current user:', user);
    console.log('All events:', events);
    
    const currentUserId = (user as any)._id || user.id;
    if (!currentUserId) {
      console.error('No user ID found');
      setIsLoading(false);
      return;
    }
    
    const filteredEvents = events.filter((event: Event) => {
      // Handle both string and object IDs for organizerId and createdBy
      const getUserId = (id: string | { _id: string } | undefined): string | null => {
        if (!id) return null;
        if (typeof id === 'string') return id;
        return id._id || null;
      };
      
      const organizerIdStr = getUserId(event.organizerId);
      const createdByIdStr = getUserId(event.createdBy);
      const currentUserIdStr = currentUserId.toString();
      
      // Check if the current user is the organizer or creator
      return organizerIdStr === currentUserIdStr || createdByIdStr === currentUserIdStr;
    });
    
    console.log('Filtered events:', filteredEvents);
    setOrganizerEvents(filteredEvents);
    setIsLoading(false);
  }, [events, user]);

  const handleEventComplete = (eventId: string, status: 'completed' | 'issue') => {
    setCompletionModal({ eventId, status });
  };

  const handleSubmitCompletion = async () => {
    if (completionModal && feedbackText.trim()) {
      try {
        const success = await markEventComplete(completionModal.eventId, completionModal.status, feedbackText);
        if (success) {
          setSuccessMessage(
            completionModal.status === 'completed' 
              ? 'Thank you for your feedback! The event has been marked as completed.'
              : 'Thank you for reporting the issue. The admin has been notified.'
          );
          setFeedbackText('');
        }
      } catch (error) {
        setErrorMessage('Failed to submit. Please try again.');
      } finally {
        setCompletionModal(null);
      }
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id'>) => {
    if (!editingEvent) return false;
    
    try {
      // Ensure we have a valid organizer ID
      let organizerId = '';
      if (eventData.organizerId) {
        organizerId = eventData.organizerId;
      } else if (editingEvent.organizerId) {
        if (typeof editingEvent.organizerId === 'string') {
          organizerId = editingEvent.organizerId;
        } else if (editingEvent.organizerId && typeof editingEvent.organizerId === 'object') {
          // TypeScript type guard to check if organizerId has _id property
          const orgId = editingEvent.organizerId as { _id: string };
          organizerId = orgId._id;
        }
      }
      
      // Create the update data with the organizer ID
      const updateData = {
        ...eventData,
        organizerId: organizerId
      };
      
      const success = await updateEvent(editingEvent.id, updateData);
      if (success) {
        setSuccessMessage('Event updated successfully!');
        setEditingEvent(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Failed to update event. Please try again.');
      return false;
    }
  };

  const upcomingEvents = organizerEvents.filter((event) => event.status === 'upcoming');
  const completedEvents = organizerEvents.filter((event) => event.status === 'completed');

  if (!user) {
    return <div>Please log in to view this page</div>;
  }

  if (isLoading) {
    return <div>Loading your events...</div>;
  }

  return (
    <div className="space-y-6 relative">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{organizerEvents.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Events</p>
              <p className="text-2xl font-semibold text-gray-900">{completedEvents.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Events</h3>
        {organizerEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No events assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(e) => {
                  setEditingEvent(e);
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                onComplete={handleEventComplete}
                userRole="organizer"
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <>
        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Edit Event</h3>
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <EventForm
                  event={editingEvent}
                  organizers={organizers}
                  onSubmit={handleUpdateEvent}
                  onCancel={() => setEditingEvent(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {completionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {completionModal.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {completionModal.status === 'completed' ? 'Event Completed Successfully' : 'Report Issue'}
                  </h3>
                </div>
                <button
                  onClick={() => setCompletionModal(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  {completionModal.status === 'completed' ? 'Share your feedback' : 'Describe the issue you faced'}
                </label>
                <textarea
                  id="feedback"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    completionModal.status === 'completed' 
                      ? 'Tell us about the event. What went well? What could be improved?'
                      : 'Please describe the issue in detail. Include any relevant information that will help us understand and resolve it.'
                  }
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setCompletionModal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCompletion}
                  disabled={!feedbackText.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    completionModal.status === 'completed'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {completionModal.status === 'completed' ? 'Submit Feedback' : 'Report Issue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    </div>
  );
};

export default OrganizerPanel;