const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event (Admin only)
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('startTime').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').isISO8601().withMessage('End time must be a valid date'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('organizerId').isMongoId().withMessage('Valid organizer ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, startTime, endTime, location, capacity, organizerId } = req.body;

    // Validate that end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check if organizer exists and has the role 'organizer'
    const User = require('../models/User');
    const organizer = await User.findOne({ _id: organizerId, role: 'organizer' });
    if (!organizer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID. The user must exist and have the organizer role.'
      });
    }

    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      location,
      capacity,
      organizerId,
      createdBy: req.user._id
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/events
// @desc    Get all events (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Role-based filtering
    if (req.user.role === 'organizer') {
      // Allow organizers to see events they created or are assigned to
      query.$or = [
        { organizerId: req.user._id },
        { createdBy: req.user._id }
      ];
    } else if (req.user.role === 'attendee') {
      query.status = { $in: ['upcoming', 'ongoing'] };
    }

    const events = await Event.find(query)
      .populate('organizerId', 'name email')
      .populate('createdBy', 'name')
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email')
      .populate('createdBy', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get booking stats
    const bookingStats = await Booking.getBookingStats(event._id);
    
    // Get feedback stats
    const feedbackStats = await Feedback.getFeedbackStats(event._id);

    res.json({
      success: true,
      data: {
        event,
        bookingStats,
        feedbackStats
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (Admin or assigned Organizer)
// @access  Private
router.put('/:id', auth, authorize('admin', 'organizer'), [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
  body('location').optional().trim().notEmpty().withMessage('Location is required'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions for organizers (admins can edit any event)
    if (req.user.role === 'organizer' && 
        event.organizerId.toString() !== req.user._id.toString() && 
        event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event - must be admin, assigned organizer, or event creator'
      });
    }

    // Validate times if both are provided
    if (req.body.startTime && req.body.endTime) {
      if (new Date(req.body.endTime) <= new Date(req.body.startTime)) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizerId', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (Admin or event creator)
// @access  Private (Admin or Organizer)
router.delete('/:id', auth, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions for organizers (admins can delete any event)
    if (req.user.role === 'organizer' && 
        event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event - must be admin or event creator'
      });
    }

    // Delete related bookings and feedback
    await Booking.deleteMany({ eventId: event._id });
    await Feedback.deleteMany({ eventId: event._id });

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/events/:id/complete
// @desc    Mark event as completed (Admin or Organizer)
// @access  Private (Admin or Organizer)
router.post('/:id/complete', auth, authorize('admin', 'organizer'), [
  body('status').isIn(['completed', 'issue']).withMessage('Status must be completed or issue'),
  body('feedback').optional().trim().notEmpty().withMessage('Feedback is required for issues')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status, feedback } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is authorized to complete this event
    if (req.user.role === 'organizer' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this event - must be admin or assigned organizer'
      });
    }

    // Check if event has ended
    if (!event.hasEnded()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete event before it ends'
      });
    }

    // Update event status
    event.status = status === 'completed' ? 'completed' : 'cancelled';
    await event.save();

    // Create feedback if provided
    if (feedback) {
      const feedbackData = {
        eventId: event._id,
        userId: req.user._id,
        userRole: 'organizer',
        rating: status === 'completed' ? 5 : 1,
        comment: feedback,
        type: status === 'completed' ? 'feedback' : 'issue'
      };

      await Feedback.create(feedbackData);
    }

    res.json({
      success: true,
      message: 'Event marked as completed',
      data: { event }
    });
  } catch (error) {
    console.error('Complete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;