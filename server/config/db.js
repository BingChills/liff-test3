const mongoose = require('mongoose');
require('dotenv').config();

// Simplified connection function
const connectDB = async () => {
  try {
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.log('Please check your .env file or Vercel environment variables');
      return null;
    }
    
    console.log('Connecting to MongoDB...');
    
    // Enhanced connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      retryReads: true,
      w: 'majority', // Write to primary and wait for acknowledgment from a majority of members
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Log connection success details
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.db.databaseName}`);
    
    // Set up connection event handlers
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Simple event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB:`, error);
    // Don't exit the process, just log the error
    console.log('Will continue without database connection');
    return null;
  }
};

module.exports = connectDB;