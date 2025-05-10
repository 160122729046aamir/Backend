const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Appointment must be for a service']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  iterationCount: {
    type: Number,
    default: 1
  },
  iterations: [{
    date: Date,
    time: String,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  }],
  isQuoteRequest: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent double booking for same service at same time
appointmentSchema.index({ service: 1, date: 1, time: 1 }, { unique: true });

// Add validation for business hours
appointmentSchema.pre('save', function(next) {
  const appointmentHour = parseInt(this.time.split(':')[0]);
  if (appointmentHour < 9 || appointmentHour > 17) {
    next(new Error('Appointments must be between 9 AM and 5 PM'));
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;