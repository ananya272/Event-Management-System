const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const feedbackRoutes = require('./routes/feedback');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { checkEventStatus } = require('./middleware/eventStatus');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Management API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Schedule tasks
// Check event status every minute
cron.schedule('* * * * *', async () => {
  try {
    await checkEventStatus();
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

// Send notifications for upcoming events (every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  try {
    const { sendEventReminders } = require('./services/notificationService');
    await sendEventReminders();
  } catch (error) {
    console.error('Error sending event reminders:', error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 