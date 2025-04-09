// Next.js API route adapter for field-specific updates (like score)
import { connectToDatabase } from '../../../../lib/mongodb';
import { updatePlayerField } from '../../../../../server/controllers/playerController';

// This handler supports PATCH requests for updating specific fields
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // PATCH - Update a specific field
  if (req.method === 'PATCH') {
    try {
      // Connect to MongoDB first
      await connectToDatabase();
      console.log('MongoDB connection established for field update');
      
      // Extract userId and field from the URL parameters
      const { userId, field } = req.query;
      
      // Set values on request object for controller compatibility
      req.userId = userId;
      req.params = { field };
      
      console.log(`Field update requested for ${userId}, field: ${field}, value:`, req.body.value);
      
      return await updatePlayerField(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}
