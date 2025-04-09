// src/lib/mongodb.js - Optimized MongoDB connection for serverless
import mongoose from 'mongoose';

// Cache the MongoDB connection to improve performance in serverless
let cachedConnection = null;

// This approach is tailored for serverless environments where
// functions may be cold-started frequently
export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedConnection) {
    return cachedConnection;
  }

  // Get MongoDB URI from environment
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Set Mongoose options optimized for serverless
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  };

  try {
    // Create a new connection
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully in serverless environment');
    
    // Cache the connection
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
