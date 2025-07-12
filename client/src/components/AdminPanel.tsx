import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Plus, Users, Star, MessageCircle, BarChart3, Loader2 } from 'lucide-react';
import EventCard from './EventCard';
import EventForm from './EventForm';
import { Event, User } from '../types';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { 
    events, 
    feedback, 
    organizers, 
    loading, 
    error,
    createEvent, 
    updateEvent, 
    deleteEvent,
    markEventComplete,
    fetchAllEvents,
    fetchAllUsers
  } = useData();
  
  // Filter events for the current user (admin)
  const adminEvents = events.filter(event => 
    event.organizerId === user?.id || event.organizerId === user?._id
  );
  
  // Filter upcoming and past events
  const now = new Date();
  const upcomingEvents = adminEvents.filter(
    (event) => new Date(event.endTime) > now
  );
  const pastEvents = adminEvents.filter(
    (event) => new Date(event.endTime) <= now
  );
  
  // State for event management
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('events');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionModal, setCompletionModal] = useState<{eventId: string; status: 'completed' | 'issue'} | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  // Load all users for admin
  useEffect(() => {
    const loadUsers = async () => {
      if (user?.role === 'admin') {
        const users = await fetchAllUsers();
        setAllUsers(users);
      }
    };
    loadUsers();
  }, [user?.role, fetchAllUsers]);

  // Handle event completion
  const handleCompleteEvent = async (eventId: string, status: 'completed' | 'issue') => {
    try {
      const success = await markEventComplete(eventId, status, feedbackText);
      if (success) {
        setCompletionModal(null);
        setFeedbackText('');
        await refreshData();
      }
    } catch (error) {
      console.error('Error completing event:', error);
      setErrorMessage('Failed to update event status');
    }
  };

  // Filter events based on the selected filter
  const filteredEvents = React.useMemo(() => {
    if (eventFilter === 'upcoming') return upcomingEvents;
    if (eventFilter === 'past') return pastEvents;
    return adminEvents;
  }, [eventFilter, upcomingEvents, pastEvents, adminEvents]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id'>) => {
    setIsSubmitting(true);
    try {
      const success = await createEvent(eventData);
      if (success) {
        setShowEventForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setIsSubmitting(true);
      try {
        const success = await updateEvent(editingEvent.id, eventData);
        if (success) {
          setEditingEvent(null);
          setShowEventForm(false);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (id: string) => {
    console.log('AdminPanel handleDeleteEvent - id:', id); // Debug log
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const success = await deleteEvent(id);
        console.log('AdminPanel handleDeleteEvent - success:', success); // Debug log
      } catch (error) {
        console.error('AdminPanel handleDeleteEvent - error:', error);
      }
    }
  };

  const averageRatings = events.map(event => ({
    ...event,
    eventFeedback: feedback.filter(f => f.eventId === event.id && f.type === 'feedback'),
  }));

  const issues = feedback.filter(f => f.type === 'issue');

  if (loading.events || loading.feedback || loading.organizers) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Organizers</p>
              <p className="text-2xl font-semibold text-gray-900">{organizers.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-semibold text-gray-900">{feedback.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Issues Reported</p>
              <p className="text-2xl font-semibold text-gray-900">{issues.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Feedback & Issues
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No events found. Create your first event!
                </div>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    userRole="admin"
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {feedback.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No feedback or issues found.
                </div>
              ) : (
                feedback.map((item) => {
                  const event = events.find(e => e.id === item.eventId);
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{event?.title}</h4>
                          <p className="text-sm text-gray-600">
                            From {item.userRole} • {new Date(item.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.type === 'feedback' && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{item.rating}</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'feedback' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{item.comment}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          organizers={organizers}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminPanel;