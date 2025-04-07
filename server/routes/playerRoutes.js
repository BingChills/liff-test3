const express = require('express');
const router = express.Router();
const { 
  getPlayerByUserId,
  createPlayer, 
  updatePlayer,
  updatePlayerField
} = require('../controllers/playerController');

// Simple middleware to pass userId to the request object
const setUserId = (req, res, next) => {
  req.userId = req.params.userId || req.body.userId;
  next();
};

// Get player data by userId
router.get('/:userId', setUserId, getPlayerByUserId);

// Create a new player
router.post('/', setUserId, createPlayer);

// Update entire player data
router.put('/:userId', setUserId, updatePlayer);

// Update specific player fields
// Special case for score updates - more permissive to ensure score gets saved
router.patch('/:userId/score', (req, res, next) => {
  console.log('Score update route accessed');
  // For score updates specifically, we'll be more lenient with validation
  // Just ensure userId is set from params
  req.userId = req.params.userId;
  next();
}, updatePlayerField);

// Other field updates use standard validation
router.patch('/:userId/:field', setUserId, (req, res, next) => {
  // Skip if it's a score update (already handled by special route above)
  if (req.params.field === 'score') return;
  next();
}, updatePlayerField);

module.exports = router;