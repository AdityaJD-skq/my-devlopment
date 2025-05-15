import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import activityLogRoutes from './routes/activityLog.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import ActivityLog from './models/ActivityLog.js';
import mockDb from './mockDb.js';
import envConfig from './env.js';

// Load environment variables
dotenv.config();
// Make env config available globally
process.env = { ...process.env, ...envConfig };

const app = express();
app.use(cors());
app.use(express.json());

// Flag for database connection status
let isDbConnected = false;

// Store models in app.locals for middleware access
app.locals.models = { User, ActivityLog };
app.locals.mockDb = mockDb;
app.locals.isDbConnected = isDbConnected;

// Basic route for API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    dbConnected: isDbConnected
  });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Function to find an available port
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api`);
    
    if (!isDbConnected) {
      // Seed mock database code here...
      const adminUser = mockDb.createUser({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$ywH8eVj9NjnB7.XzU9IYgOJmRIbXPrNKJZ1D.L/2F6tDxKGNJMBta', // "password123"
        role: 'Developer',
        isActive: true,
        isConfirmed: true
      });
      console.log('Mock database seeded with admin user:', adminUser.email);
    }
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
  
  return server;
};

// Connect to MongoDB with improved error handling
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log('MongoDB connection successful');
    isDbConnected = true;
    app.locals.isDbConnected = true;
    startServer(PORT);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Starting server with mock database...');
    
    // Start server with mock database
    isDbConnected = false;
    app.locals.isDbConnected = false;
    startServer(PORT);
  }); 