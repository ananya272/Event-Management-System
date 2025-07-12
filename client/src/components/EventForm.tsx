import React, { useState, useEffect } from 'react';
import { Event, User } from '../types';
import { X } from 'lucide-react';

interface EventFormProps {
  event?: Event | null;
  organizers: User[];
  onSubmit: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, organizers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
    organizerId: '',
  });
  const [validationError, setValidationError] = useState('');

  // Debug: Log organizers and event data
  console.log('EventForm - organizers:', organizers);
  console.log('EventForm - event:', event);

  useEffect(() => {
    if (event) {
      // When editing an event, use the event's organizerId or default to the first available organizer
      const organizerId = event.organizerId || 
                        (organizers.length > 0 ? (organizers[0]._id || organizers[0].id) : '');
      
      // Ensure startTime and endTime are Date objects before calling toISOString
      const startTime = event.startTime instanceof Date ? event.startTime : new Date(event.startTime);
      const endTime = event.endTime instanceof Date ? event.endTime : new Date(event.endTime);
      
      setFormData({
        title: event.title,
        description: event.description,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        location: event.location,
        capacity: event.capacity,
        organizerId: organizerId,
      });
    } else if (organizers.length > 0) {
      // Set default organizer when creating a new event
      setFormData(prev => ({
        ...prev,
        organizerId: organizers[0]._id || organizers[0].id // Handle both MongoDB _id and client-side id
      }));
    } else {
      console.warn('No organizers available in EventForm');
    }
  }, [event, organizers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Debug: Log form data
    console.log('Form data:', formData);
    console.log('Organizers available:', organizers);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setValidationError('Please enter an event title');
      return;
    }
    
    if (!formData.description.trim()) {
      setValidationError('Please enter an event description');
      return;
    }
    
    if (!formData.startTime) {
      setValidationError('Please select a start time');
      return;
    }
    
    if (!formData.endTime) {
      setValidationError('Please select an end time');
      return;
    }
    
    if (!formData.location.trim()) {
      setValidationError('Please enter a location');
      return;
    }
    
    if (!formData.capacity || formData.capacity < 1) {
      setValidationError('Please enter a valid capacity (minimum 1)');
      return;
    }
    
    if (!formData.organizerId) {
      setValidationError('Please select an organizer');
      return;
    }
    
    // Find the selected organizer to ensure we have a valid ID
    const selectedOrganizer = organizers.find(org => org._id === formData.organizerId || org.id === formData.organizerId);
    if (!selectedOrganizer) {
      setValidationError('Selected organizer is not valid');
      return;
    }
    
    // Validate that end time is after start time
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    
    if (endTime <= startTime) {
      setValidationError('End time must be after start time');
      return;
    }
    
    const eventData: Omit<Event, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startTime: startTime,
      endTime: endTime,
      location: formData.location.trim(),
      capacity: formData.capacity,
      organizerId: selectedOrganizer._id || selectedOrganizer.id, // Use the correct ID format
      status: 'upcoming',
      feedbackEnabled: true,
    };

    console.log('Submitting event data:', eventData);
    onSubmit(eventData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {event ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {validationError}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime || new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="organizerId" className="block text-sm font-medium text-gray-700 mb-2">
              Assign Organizer
            </label>
            <select
              id="organizerId"
              name="organizerId"
              value={formData.organizerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={organizers.length === 0}
            >
              <option value="">Select an organizer</option>
              {organizers.length === 0 ? (
                <option value="" disabled>No organizers available</option>
              ) : (
                organizers.map((organizer) => (
                  <option key={organizer._id || organizer.id} value={organizer._id || organizer.id}>
                    {organizer.name} ({organizer.email})
                  </option>
                ))
              )}
            </select>
            {organizers.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No organizers found. Please add an organizer first or contact the administrator.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;