// Next.js API route adapter for specific player operations
import { getPlayerByUserId, updatePlayer, updatePlayerField } from '../../../../server/controllers/playerController';

// This handler supports GET, PUT, and PATCH requests for specific players
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Extract userId from the URL parameter
  const { userId } = req.query;
  
  // Set userId on request object for controller compatibility
  req.userId = userId;
  
  try {
    // GET - Retrieve a player's data
    if (req.method === 'GET') {
      return await getPlayerByUserId(req, res);
    }
    
    // PUT - Update entire player data
    if (req.method === 'PUT') {
      return await updatePlayer(req, res);
    }
    
    // PATCH - Update specific fields (particularly for score updates)
    if (req.method === 'PATCH') {
      return await updatePlayerField(req, res);
    }
    
    // Return 405 Method Not Allowed for other methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
