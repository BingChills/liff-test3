const mongoose = require('mongoose');
require('dotenv').config();

// Cached connection
let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (!process.env.MONGODB_URI) {
      console.error('MongoDB URI is not defined in environment variables');
      throw new Error('MongoDB URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    
    // Enhanced connection options for better security and performance
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Log connection success details
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.db.databaseName}`);
    
    // Set up connection event handlers
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cachedConnection = null;
    });
    
    // Handle graceful closure on application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(error.stack);
    // Don't exit the process, allow the application to handle the error
    throw error;
  }
};

module.exports = connectDB;