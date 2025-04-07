const mongoose = require('mongoose');
require('dotenv').config();

// Very simple connection for the demo
const connectDB = async () => {
  try {
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.log('Please check your .env file or Vercel environment variables');
      return null;
    }
    
    console.log('Connecting to MongoDB...');
    
    // Minimal connection options, optimized for Vercel
    const options = {
      // Remove deprecated options
      // Add SSL options to fix connection issues
      ssl: true,
      sslValidate: false, // For demo only
      retryWrites: false, // Disable retryWrites which can cause issues
      maxPoolSize: 2, // Reduce connection pool for Vercel
      connectTimeoutMS: 5000 // Shorter timeout
    };
    
    // Extract the main part of the connection string
    const uri = process.env.MONGODB_URI.split('?')[0];
    console.log('Using simplified MongoDB connection');
    
    const conn = await mongoose.connect(uri, options);
    
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