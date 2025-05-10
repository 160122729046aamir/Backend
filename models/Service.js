const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  image: {
    type: String,
    required: [true, 'Service image is required']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: [
      'Electrical Engineering',
      'Electronics',
      'Coffee Machine Service',
      'Gym Equipment Repair',
      'Catering Equipment Service',
      'Medical Equipment Service',
      'Electromechanical',
      'Clocks',
      'Network Service',
      'Smart Home System'
    ]
  },
  priceRange: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    }
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;