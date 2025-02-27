import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Agreement', 'Notice', 'Request', 'Affidavit', 'Petition', 'Other'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  legalDomain: {
    type: String,
    enum: ['Criminal', 'Civil', 'Corporate', 'Family', 'Intellectual Property', 'Tax', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'final'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  pdfUrl: {
    type: String
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Document = mongoose.model('Document', documentSchema);

export default Document;