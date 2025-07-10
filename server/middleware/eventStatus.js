const Event = require('../models/Event');

const checkEventStatus = async () => {
  try {
    const now = new Date();
    
    // Update ongoing events
    await Event.updateMany(
      {
        status: 'upcoming',
        startTime: { $lte: now },
        endTime: { $gte: now }
      },
      { status: 'ongoing' }
    );
    
    // Update completed events
    await Event.updateMany(
      {
        status: { $in: ['upcoming', 'ongoing'] },
        endTime: { $lt: now }
      },
      { status: 'completed' }
    );
    
    console.log('Event status check completed');
  } catch (error) {
    console.error('Error checking event status:', error);
  }
};

module.exports = { checkEventStatus }; 