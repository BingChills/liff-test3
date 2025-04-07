const mongoose = require('mongoose');
require('dotenv').config();

// Lightweight connection function for the demo
let isConnected = false;

// Simplest possible connection function
const connectDB = async () => {
  try {
    // If already connected, return the existing connection
    if (isConnected) {
      console.log('🟢 Using existing MongoDB connection');
      return mongoose.connection;
    }
    
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined');
      return null;
    }
    
    console.log('🔌 Connecting to MongoDB...');
    
    // For this demo, use absolutely minimal connection options
    // Everything defaults to MongoDB driver defaults
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Mark as connected
    isConnected = true;
    
    // Log success
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    // Handle specific error types with more helpful messages
    if (error.name === 'MongoParseError') {
      console.error('❌ MongoDB connection string error:', error.message);
    } else if (error.name === 'MongoNetworkError') {
      console.error('❌ MongoDB network error - check your connection and VPN');
    } else {
      console.error('❌ MongoDB connection error:', error);
    }
    
    isConnected = false;
    return null;
  }
};

module.exports = connectDB;