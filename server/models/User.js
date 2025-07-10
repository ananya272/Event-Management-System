const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'organizer', 'attendee'],
    required: [true, 'Role is required']
  },
  cancelledBookings: {
    type: Number,
    default: 0
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment cancelled bookings
userSchema.methods.incrementCancelledBookings = async function() {
  this.cancelledBookings += 1;
  if (this.cancelledBookings >= 2) {
    this.isBlocked = true;
  }
  return await this.save();
};

// Method to check if user can book events
userSchema.methods.canBookEvents = function() {
  return !this.isBlocked;
};

// Virtual for public user data (without password)
userSchema.virtual('publicData').get(function() {
  const userData = this.toObject();
  delete userData.password;
  return userData;
});

module.exports = mongoose.model('User', userSchema); 