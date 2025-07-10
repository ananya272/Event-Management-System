export interface User {
  _id?: string; // MongoDB ID
  id: string;   // Alias for _id for compatibility
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'attendee';
  createdAt: Date;
  cancelledBookings?: number;
  isBlocked?: boolean;
}

export interface Event {
  _id?: string; // MongoDB ID
  id: string; // Client-side ID
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  type: 'reminder' | 'booking' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  organizerId?: string;
  createdBy?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  feedbackEnabled: boolean;
  averageRating?: number;
  totalFeedback?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  bookedAt: Date;
  status: 'active' | 'cancelled';
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userRole: 'organizer' | 'attendee';
  rating: number;
  comment: string;
  submittedAt: Date;
  type: 'feedback' | 'issue';
}

export interface Notification {