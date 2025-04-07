const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Ultra-minimal MongoDB connection for the demo
 * Just uses the default MongoDB driver options with no custom parameters
 */
let isConnected = false;

const connectDB = async () => {
  try {
    // If already connected, return existing connection
    if (isConnected) {
      console.log('🟢 Using existing MongoDB connection');
      return mongoose.connection;
    }
    
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not defined in environment variables');
      return null;
    }
    
    console.log('🔌 Attempting MongoDB connection...');
    
    // ULTRA-SIMPLE CONNECTION - NO CUSTOM OPTIONS
    // This avoids all parameter errors by using the driver defaults
    await mongoose.connect(process.env.MONGODB_URI);
    
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully`);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Will continue with localStorage only');
    return null;
  }
};

module.exports = connectDB;