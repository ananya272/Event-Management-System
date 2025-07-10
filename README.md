# Event Management System - Setup Guide

This guide will help you set up and run the complete Event Management System with both frontend and backend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
# Copy config.env and modify if needed
# Default values should work for local development

# Start MongoDB (if using local instance)
# Make sure MongoDB is running on your system

# Seed the database with test data
npm run seed

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration (`server/config.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000/api` by default. If you change the backend port, update the `API_BASE_URL` in `client/src/services/api.ts`.

## 🧪 Test Accounts

After running the seed script, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Organizer | organizer@example.com | password123 |
| Attendee | attendee@example.com | password123 |
| Attendee 2 | mike@example.com | password123 |

## 📝 User Registration

New users can create accounts through the signup page:

### Signup Features
- ✅ User-friendly registration form
- ✅ Role selection (Attendee, Organizer, Admin)
- ✅ Real-time form validation
- ✅ Password confirmation
- ✅ Email format validation
- ✅ Success/error feedback
- ✅ Automatic redirect to login after successful registration

### Registration Process
1. Navigate to `/signup` or click "Sign up here" on the login page
2. Fill in your details (name, email, password)
3. Select your desired role
4. Submit the form
5. Upon successful registration, you'll be redirected to login
6. Sign in with your new credentials

### Role Descriptions
- **Attendee**: Book and attend events, submit feedback
- **Organizer**: Manage assigned events, update event details
- **Admin**: Full system access, manage all users and events

## 📋 Features by Role

### 👨‍💼 Admin Features
- ✅ Create, update, and delete events
- ✅ Assign events to organizers
- ✅ View all feedback and issues
- ✅ View average ratings for events
- ✅ Manage users (view, update, delete, unblock)

### 🧑‍💻 Organizer Features
- ✅ View assigned events
- ✅ Edit event details
- ✅ Mark events as completed or report issues
- ✅ Submit feedback after completion

### 🙋‍♂️ Attendee Features
- ✅ View upcoming events
- ✅ Book events with details
- ✅ Cancel bookings (with blocking after 2 cancellations)
- ✅ Submit feedback after events
- ✅ Receive notifications for upcoming events

## 🔄 API Integration

The frontend is now fully integrated with the backend API:

### Authentication
- JWT token-based authentication
- User registration and login
- Automatic token storage and retrieval
- Session persistence across browser refreshes
- Role-based access control

### Data Management
- Real-time data synchronization
- Loading states for better UX
- Error handling and display
- Automatic data refresh after operations

### Key API Endpoints Used
- `/api/auth/*` - Authentication
- `/api/events/*` - Event management
- `/api/bookings/*` - Booking operations
- `/api/feedback/*` - Feedback system
- `/api/notifications/*` - Notifications
- `/api/users/*` - User management

## 🛠️ Development

### Backend Development
```bash
cd server
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm run dev  # Starts Vite dev server
```

### Database Management
```bash
cd server
npm run seed  # Reseed database with test data
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if MongoDB is running
   - Verify port 5000 is available
   - Check `config.env` file exists

2. **Frontend can't connect to backend**
   - Ensure backend is running on port 5000
   - Check CORS settings in backend
   - Verify API_BASE_URL in frontend

3. **Authentication issues**
   - Clear browser localStorage
   - Check JWT token in browser dev tools
   - Verify backend JWT_SECRET

4. **Database connection issues**
   - Check MongoDB connection string
   - Ensure MongoDB is running
   - Verify database permissions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend config.

## 📁 Project Structure

```
eventmanagement/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API service
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   └── package.json
└── README.md
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas or production database
4. Set up environment variables on your hosting platform

### Frontend Deployment
1. Update `API_BASE_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 📞 Support

If you encounter any issues:

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify all dependencies are installed
4. Ensure MongoDB is running and accessible
5. Check network connectivity between frontend and backend

## 🎉 Success!

Once everything is running, you should see:
- Backend API responding on `http://localhost:5000`
- Frontend application on `http://localhost:5173`
- Ability to log in with test accounts
- Full functionality for all user roles

The system is now fully integrated and ready for use! 