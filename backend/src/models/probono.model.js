import mongoose from 'mongoose';

const probonoSchema = new mongoose.Schema({
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  areasOfPractice: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  startingCharge: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Both'],
    required: true
  },
  languages: [{
    type: String,
    required: true
  }],
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  casesHandled: {
    type: Number,
    default: 0
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

probonoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProBono = mongoose.model('ProBono', probonoSchema);

export default ProBono;