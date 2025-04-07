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
    
    // Simple connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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