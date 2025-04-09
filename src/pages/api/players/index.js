// Next.js API route adapter for players endpoint
import { createPlayer } from '../../../../server/controllers/playerController';

// This handler supports POST requests to create new players
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // POST - Create a new player
  if (req.method === 'POST') {
    try {
      // Set userId from body for controller compatibility
      req.userId = req.body.userId;
      return await createPlayer(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}
