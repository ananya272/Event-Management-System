# Event Management System - Backend

A comprehensive backend API for the Event Management System with role-based access control for Admin, Organizer, and Attendee roles.

## Features

### 👨‍💼 Admin Panel
- Create, update, and delete events
- Assign events to organizers
- View all feedback and issues from organizers and attendees
- View average ratings for each event
- Manage users (view, update, delete, unblock)

### 🧑‍💻 Organizer Panel
- View events assigned by admin
- Edit event details
- Mark events as completed or report issues
- Submit feedback after event completion

### 🙋‍♂️ Attendee Panel
- View upcoming events
- Book events with basic details
- Cancel bookings (with blocking after 2 cancellations)
- Submit feedback after event completion
- Receive notifications for upcoming events

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **moment** - Date handling
- **node-cron** - Scheduled tasks

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` and modify as needed:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud)

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/organizers` - Get all organizers (Admin only)

### Events
- `POST /api/events` - Create event (Admin only)
- `GET /api/events` - Get events (filtered by role)
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event (Admin/Organizer)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/:id/complete` - Mark event complete (Organizer)

### Bookings
- `POST /api/bookings` - Create booking (Attendee)
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking (Attendee)
- `GET /api/bookings/event/:eventId` - Get event bookings (Admin/Organizer)

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback (filtered by role)
- `GET /api/feedback/:id` - Get single feedback
- `GET /api/feedback/event/:eventId` - Get event feedback
- `DELETE /api/feedback/:id` - Delete feedback (Admin only)

### Notifications
- `GET /api/notifications` - Get user's notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/clear-all` - Clear all notifications

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/unblock` - Unblock user (Admin only)

## Database Models

### User
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin/organizer/attendee)
- `cancelledBookings` - Count of cancelled bookings
- `isBlocked` - Blocked status for attendees

### Event
- `title` - Event title
- `description` - Event description
- `startTime` - Event start time
- `endTime` - Event end time
- `location` - Event location
- `capacity` - Maximum attendees
- `organizerId` - Assigned organizer
- `createdBy` - Admin who created the event
- `status` - Event status (upcoming/ongoing/completed/cancelled)
- `averageRating` - Average feedback rating
- `totalFeedback` - Total number of feedback

### Booking
- `eventId` - Associated event
- `attendeeId` - User who booked
- `attendeeName` - Attendee's name
- `attendeeEmail` - Attendee's email
- `attendeePhone` - Attendee's phone
- `status` - Booking status (active/cancelled)

### Feedback
- `eventId` - Associated event
- `userId` - User who submitted feedback
- `userRole` - Role of the user
- `rating` - Rating (1-5)
- `comment` - Feedback comment
- `type` - Feedback type (feedback/issue)

### Notification
- `userId` - User to notify
- `eventId` - Associated event
- `message` - Notification message
- `type` - Notification type
- `read` - Read status

## Scheduled Tasks

- **Event Status Check** - Runs every minute to update event status
- **Event Reminders** - Runs every 5 minutes to send 10-minute reminders

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS enabled
- Error handling middleware

## Testing

The backend includes test accounts created by the seed script:

- **Admin**: admin@example.com / password123
- **Organizer**: organizer@example.com / password123
- **Attendee**: attendee@example.com / password123
- **Attendee 2**: mike@example.com / password123

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/event-management |
| `JWT_SECRET` | JWT signing secret | your-super-secret-jwt-key-change-this-in-production |
| `NODE_ENV` | Environment mode | development |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test data
- `npm test` - Run tests (if configured)

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- JWT errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 