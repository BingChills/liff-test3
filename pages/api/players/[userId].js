// Simple API endpoint for saving player data
import mongoose from 'mongoose';
// Import MongoDB URI using require because it's a CommonJS module
const { MongoDBURI } = require('../../../server/config/db');

// Connect to MongoDB
const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(MongoDBURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Define Player Schema
const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String, default: null },
  pictureUrl: { type: String, default: null },
  statusMessage: { type: String, default: null },
  score: { type: Number, default: 0 },
  point: { type: Number, default: 0 },
  stores: { type: Array, default: [] },
  characters: { type: Array, default: [] },
  coupons: { type: Array, default: [] },
  stamina: { type: Object, default: { current: 20, max: 20 } },
  selectedStore: { type: Object, default: null },
  drawCount: { type: Number, default: 0 },
  remainingDraws: { type: Number, default: 3 },
  updatedAt: { type: Date, default: Date.now }
});

// Create or get the model (prevents model overwrite errors in development)
const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);

export default async function handler(req, res) {
  const { userId } = req.query;
  
  try {
    await connectToDB();
    
    // Only handle PUT requests for saving on page close
    if (req.method === 'PUT') {
      const playerData = req.body;
      
      // Update player data or create if not exists
      const player = await Player.findOneAndUpdate(
        { userId },
        { ...playerData, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      
      return res.status(200).json(player);
    }
    
    // Only allow PUT requests
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
