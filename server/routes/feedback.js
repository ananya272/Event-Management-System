const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { auth, authorize } = require('../middleware/auth');
const { createFeedbackNotification, createIssueNotification } = require('../services/notificationService');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback for an event
// @access  Private
router.post('/', auth, [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('type').isIn(['feedback', 'issue']).withMessage('Type must be feedback or issue')
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

    const { eventId, rating, comment, type } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to submit feedback
    if (req.user.role === 'attendee') {
      // Check if attendee has an active booking for this event
      const booking = await Booking.findOne({
        eventId,
        attendeeId: req.user._id,
        status: 'active'
      });

      if (!booking) {
        return res.status(403).json({
          success: false,
          message: 'You must have an active booking to submit feedback'
        });
      }

      // Check if event has ended
      if (!event.hasEnded()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot submit feedback before event ends'
        });
      }
    } else if (req.user.role === 'organizer') {
      // Check if organizer is assigned to this event
      if (event.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to submit feedback for this event'
        });
      }
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      eventId,
      userId: req.user._id,
      type
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this event'
      });
    }

    // Create feedback
    const feedback = new Feedback({
      eventId,
      userId: req.user._id,
      userRole: req.user.role,
      rating,
      comment,
      type
    });

    await feedback.save();

    // Create notification for admin
    if (type === 'feedback') {
      await createFeedbackNotification(eventId, event.title, req.user.role);
    } else {
      await createIssueNotification(eventId, event.title);
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback
// @desc    Get feedback (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { eventId, type, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (eventId) {
      query.eventId = eventId;
    }

    if (type) {
      query.type = type;
    }

    // Role-based filtering
    if (req.user.role === 'attendee') {
      query.userId = req.user._id;
    } else if (req.user.role === 'organizer') {
      // Get events assigned to this organizer
      const events = await Event.find({ organizerId: req.user._id });
      const eventIds = events.map(event => event._id);
      query.eventId = { $in: eventIds };
    }
    // Admin can see all feedback

    const feedback = await Feedback.find(query)
      .populate('eventId', 'title startTime endTime')
      .populate('userId', 'name email role')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback/:id
// @desc    Get single feedback
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('eventId', 'title startTime endTime')
      .populate('userId', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check permissions
    if (req.user.role === 'attendee' && feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this feedback'
      });
    }

    if (req.user.role === 'organizer') {
      const event = await Event.findById(feedback.eventId);
      if (!event || event.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this feedback'
        });
      }
    }

    res.json({
      success: true,
      data: { feedback }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/feedback/event/:eventId
// @desc    Get all feedback for an event
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
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

    // Check permissions
    if (req.user.role === 'organizer' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view feedback for this event'
      });
    }

    const feedback = await Feedback.find({ eventId })
      .populate('userId', 'name email role')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments({ eventId });

    // Get feedback statistics
    const stats = await Feedback.getFeedbackStats(eventId);

    res.json({
      success: true,
      data: {
        feedback,
        stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get event feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (Admin only)
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    // Update event average rating
    const event = await Event.findById(feedback.eventId);
    if (event) {
      await event.updateAverageRating();
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 