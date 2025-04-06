// Vercel serverless function adapter for Express server
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import the Express app
const app = require('../server/server');

// Export a handler for Vercel
module.exports = (req, res) => {
  // Forward the request to the Express app
  return app(req, res);
};
