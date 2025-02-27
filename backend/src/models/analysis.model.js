import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemDescription: {
    type: String,
    required: [true, 'Please provide a description of the legal problem']
  },
  areaOfLaw: {
    type: String,
    required: [true, 'Please specify the area of law'],
    enum: ['Criminal', 'Civil', 'Corporate', 'Family', 'Intellectual Property', 'Tax', 'Other']
  },
  analysis: {
    riskLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    resolutionProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    complexity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    timeEstimate: {
      type: String,
      required: true
    }
  },
  suggestedLawyers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProBono'
  }],
  steps: [{
    stepNumber: Number,
    description: String,
    estimatedTime: String
  }],
  relevantArticles: [{
    articleNumber: String,
    title: String,
    description: String,
    relevance: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;