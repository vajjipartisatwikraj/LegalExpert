import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Enable trust proxy for rate limiter behind reverse proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://legalexpert-frontend.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(limiter);

// MongoDB Connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 90000,
  connectTimeoutMS: 60000,
  retryWrites: true,
  maxPoolSize: 50,
  wtimeoutMS: 30000,
  heartbeatFrequencyMS: 2000,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true // Only for development, remove in production with proper certificates
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legalexpert', mongooseOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Implement retry logic instead of immediate exit
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      process.exit(1);
    }, 5000);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

// Import routes
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import documentRoutes from './routes/document.routes.js';
import probonoRoutes from './routes/probono.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import translationRoutes from './routes/translationRoutes.js';

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/probono', probonoRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api', translationRoutes);  // Mount translation routes

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LegalExpert.AI API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});