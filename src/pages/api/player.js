// Next.js API route for player operations with query parameters instead of path parameters
import { connectToDatabase } from '../../lib/mongodb';
import { getPlayerByUserId, updatePlayer, updatePlayerField } from '../../../server/controllers/playerController';

// This handler supports GET, PUT, and PATCH requests for specific players
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Make sure userId is provided as query param
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required as a query parameter' });
  }
  
  // Set userId in request object for controller compatibility
  req.userId = userId;
  
  try {
    // Connect to MongoDB first
    await connectToDatabase();
    console.log('MongoDB connection established for player operations');
    
    // GET - Retrieve a player's data
    if (req.method === 'GET') {
      return await getPlayerByUserId(req, res);
    }
    
    // PUT - Update a player's entire data
    if (req.method === 'PUT') {
      return await updatePlayer(req, res);
    }
    
    // PATCH - Update a specific field of a player's data
    if (req.method === 'PATCH') {
      // Extract field from body instead of URL
      const { field } = req.body;
      if (!field) {
        return res.status(400).json({ error: 'field parameter is required in request body for PATCH' });
      }
      
      // Set field in request for controller compatibility
      req.params = { field };
      return await updatePlayerField(req, res);
    }
    
    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(`Error in player API endpoint: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
