import connectDB from '../../../../server/config/db';
import Player from '../../../../server/models/Player';
import { validateLineUser } from '../../../../server/middleware/authMiddleware';

// Connect to DB on first request
connectDB();

// Middleware wrapper for Next.js API routes
const withMiddleware = (middleware) => {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };
};

export default async function handler(req, res) {
  const { userId } = req.query;
  
  try {
    // Apply middleware
    await withMiddleware(validateLineUser)(req, res);
    
    // GET request - Get player by userId
    if (req.method === 'GET') {
      // Look for existing player
      const player = await Player.findOne({ userId });
      
      // Return 404 if player doesn't exist
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      return res.json(player);
    }
    
    // PUT request - Update entire player data
    else if (req.method === 'PUT') {
      const updates = req.body;
      
      const player = await Player.findOneAndUpdate(
        { userId },
        { ...updates, lastUpdated: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      return res.json(player);
    }
    
    // Method not allowed
    else {
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error in player API: ${error.message}`);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
