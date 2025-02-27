import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['public', 'lawyer'],
    default: 'public'
  },
  // Lawyer specific fields
  lawyerProfile: {
    experience: {
      type: Number,
      required: function() { return this.role === 'lawyer'; }
    },
    domains: [{
      type: String,
      enum: ['Criminal', 'Civil', 'Corporate', 'Family', 'Intellectual Property', 'Tax', 'Other']
    }],
    charges: {
      type: Number,
      required: function() { return this.role === 'lawyer'; }
    },
    solvedCases: {
      type: Number,
      default: 0
    },
    ratings: [{
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Calculate average rating before saving
userSchema.pre('save', function(next) {
  if (this.role === 'lawyer' && this.lawyerProfile.ratings.length > 0) {
    const totalRating = this.lawyerProfile.ratings.reduce((acc, item) => acc + item.rating, 0);
    this.lawyerProfile.averageRating = totalRating / this.lawyerProfile.ratings.length;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;