const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const Feedback = require('./models/Feedback');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const organizer1 = await User.create({
      name: 'John Organizer',
      email: 'organizer@example.com',
      password: 'password123',
      role: 'organizer'
    });

    const organizer2 = await User.create({
      name: 'Sarah Manager',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'organizer'
    });

    const attendee1 = await User.create({
      name: 'Jane Attendee',
      email: 'attendee@example.com',
      password: 'password123',
      role: 'attendee'
    });

    const attendee2 = await User.create({
      name: 'Mike Participant',
      email: 'mike@example.com',
      password: 'password123',
      role: 'attendee'
    });

    console.log('Created users');

    // Create events
    const event1 = await Event.create({
      title: 'Tech Conference 2024',
      description: 'Annual technology conference featuring latest innovations in AI, blockchain, and cloud computing. Join industry experts for networking and knowledge sharing.',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Tomorrow + 8 hours
      location: 'Convention Center',
      capacity: 500,
      organizerId: organizer1._id,
      createdBy: admin._id,
      status: 'upcoming'
    });

    const event2 = await Event.create({
      title: 'Workshop: React Best Practices',
      description: 'Learn advanced React patterns and best practices from experienced developers. Hands-on coding session with real-world examples.',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // Day after tomorrow + 4 hours
      location: 'Training Room A',
      capacity: 30,
      organizerId: organizer1._id,
      createdBy: admin._id,
      status: 'upcoming'
    });

    const event3 = await Event.create({
      title: 'Marketing Summit 2024',
      description: 'Comprehensive marketing strategies and digital transformation insights. Network with marketing professionals and learn from case studies.',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      location: 'Business Center',
      capacity: 200,
      organizerId: organizer2._id,
      createdBy: admin._id,
      status: 'upcoming'
    });

    const event4 = await Event.create({
      title: 'Completed Event Example',
      description: 'This is an example of a completed event for testing purposes.',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 2 days ago + 3 hours
      location: 'Virtual Meeting',
      capacity: 100,
      organizerId: organizer1._id,
      createdBy: admin._id,
      status: 'completed'
    });

    console.log('Created events');

    // Create bookings
    const booking1 = await Booking.create({
      eventId: event1._id,
      attendeeId: attendee1._id,
      attendeeName: 'Jane Attendee',
      attendeeEmail: 'attendee@example.com',
      attendeePhone: '+1234567890',
      status: 'active'
    });

    const booking2 = await Booking.create({
      eventId: event2._id,
      attendeeId: attendee1._id,
      attendeeName: 'Jane Attendee',
      attendeeEmail: 'attendee@example.com',
      attendeePhone: '+1234567890',
      status: 'active'
    });

    const booking3 = await Booking.create({
      eventId: event3._id,
      attendeeId: attendee2._id,
      attendeeName: 'Mike Participant',
      attendeeEmail: 'mike@example.com',
      attendeePhone: '+1987654321',
      status: 'active'
    });

    console.log('Created bookings');

    // Create feedback
    const feedback1 = await Feedback.create({
      eventId: event4._id,
      userId: attendee1._id,
      userRole: 'attendee',
      rating: 5,
      comment: 'Excellent event! Very informative and well organized. The speakers were knowledgeable and the content was relevant.',
      type: 'feedback'
    });

    const feedback2 = await Feedback.create({
      eventId: event4._id,
      userId: organizer1._id,
      userRole: 'organizer',
      rating: 4,
      comment: 'Event went smoothly with good attendance. Some technical issues with the streaming platform but overall successful.',
      type: 'feedback'
    });

    console.log('Created feedback');

    // Update event average ratings
    await event4.updateAverageRating();

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Organizer: organizer@example.com / password123');
    console.log('Attendee: attendee@example.com / password123');
    console.log('Attendee 2: mike@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData(); 