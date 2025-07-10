const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { createBookingNotification, createCancellationNotification } = require('../services/notificationService');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (Attendee only)
// @access  Private (Attendee only)
router.post('/', auth, authorize('attendee'), [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('attendeeName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('attendeeEmail').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('attendeePhone').trim().notEmpty().withMessage('Phone number is required')
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

    const { eventId, attendeeName, attendeeEmail, attendeePhone } = req.body;

    // Check if user is blocked
    if (!req.user.canBookEvents()) {
      return res.status(403).json({
        success: false,
        message: 'You are blocked from booking events due to multiple cancellations'
      });
    }

    // Check if event exists and is available
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Event is not available for booking'
      });
    }

    // Check if event is full
    const activeBookings = await Booking.countDocuments({
      eventId,
      status: 'active'
    });

    if (activeBookings >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user already has an active booking for this event
    const existingBooking = await Booking.findOne({
      eventId,
      attendeeId: req.user._id,
      status: 'active'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking for this event'
      });
    }

    // Create booking
    const booking = new Booking({
      eventId,
      attendeeId: req.user._id,
      attendeeName,
      attendeeEmail,
      attendeePhone
    });

    await booking.save();

    // Create notification
    await createBookingNotification(req.user._id, eventId, event.title);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { attendeeId: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('eventId', 'title startTime endTime location status')
      .sort({ bookedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventId', 'title startTime endTime location status organizerId')
      .populate('eventId.organizerId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.attendeeId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking (Attendee only)
// @access  Private (Attendee only)
router.put('/:id/cancel', auth, authorize('attendee'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.attendeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Get event details for notification
    const event = await Event.findById(booking.eventId);

    // Cancel booking
    await booking.cancel();

    // Increment user's cancelled bookings count
    await req.user.incrementCancelledBookings();

    // Create cancellation notification
    if (event) {
      await createCancellationNotification(req.user._id, booking.eventId, event.title);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/event/:eventId
// @desc    Get all bookings for an event (Admin/Organizer only)
// @access  Private (Admin/Organizer only)
router.get('/event/:eventId', auth, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions for organizer
    if (req.user.role === 'organizer' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bookings for this event'
      });
    }

    const bookings = await Booking.find({ eventId })
      .populate('attendeeId', 'name email')
      .sort({ bookedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({ eventId });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get event bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 