import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Users, Star, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  onBook?: (event: Event) => void;
  onComplete?: (eventId: string, status: 'completed' | 'issue') => void;
  showActions?: boolean;
  userRole?: 'admin' | 'organizer' | 'attendee';
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onBook,
  onComplete,
  showActions = true,
  userRole,
}) => {
  const getDateObject = (dateValue: string | Date): Date => {
    return typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  };

  const isEventEnded = new Date() > getDateObject(event.endTime);
  const isEventStartingSoon = 
    getDateObject(event.startTime).getTime() - 10 * 60 * 1000 <= new Date().getTime();

  const formatDate = (date: string | Date) => {
    return getDateObject(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: string | Date) => {
    return getDateObject(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
          </div>
          {event.averageRating && (
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">
                {event.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(event.startTime)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Capacity: {event.capacity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : event.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
              {event.status}
            </span>
            {isEventStartingSoon && event.status === 'upcoming' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full animate-pulse">
                Starting Soon
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              {(userRole === 'admin' || (userRole === 'organizer' && (event.organizerId === event.createdBy || event.createdBy === event.organizerId || event.organizerId === event.organizerId))) && (
                <>
                  <button
                    onClick={() => onEdit && onEdit(event)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                    title={userRole === 'admin' ? 'Admin can edit all events' : 'Organizer can edit events they created or are assigned to'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      console.log('EventCard Delete button - event:', event); // Debug log
                      if (onDelete && event.id) {
                        onDelete(event.id);
                      } else {
                        console.error('EventCard Delete button - Missing event ID');
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                    title={userRole === 'admin' ? 'Admin can delete all events' : 'Organizer can only delete events they created'}
                  >
                    Delete
                  </button>
                </>
              )}
              
              {(userRole === 'admin' || userRole === 'organizer') && isEventEnded && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onComplete && onComplete(event.id, 'completed')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    ✅ Completed
                  </button>
                  <button
                    onClick={() => onComplete && onComplete(event.id, 'issue')}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors duration-200"
                  >
                    ⚠️ Issue
                  </button>
                </div>
              )}
              
              {userRole === 'attendee' && event.status === 'upcoming' && (
                <button
                  onClick={() => onBook && onBook(event)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Book Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;