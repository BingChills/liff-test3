import connectDB from '../../../../../server/config/db';
import Player from '../../../../../server/models/Player';
import { validateLineUser } from '../../../../../server/middleware/authMiddleware';

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
  // Only allow PATCH method for this endpoint
  if (req.method === 'PATCH') {
    try {
      // Apply middleware
      await withMiddleware(validateLineUser)(req, res);
      
      const { userId, field } = req.query;
      const { value } = req.body;
      
      // Construct update object with the field to update
      const updateObject = {
        [field]: value,
        lastUpdated: Date.now()
      };
      
      const player = await Player.findOneAndUpdate(
        { u_id: userId },
        { $set: updateObject },
        { new: true, runValidators: true }
      );
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      res.json(player);
    } catch (error) {
      console.error(`Error in updatePlayerField: ${error.message}`);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
