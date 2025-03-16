const express = require('express');
const router = express.Router();
const { 
  getPlayerByUserId,
  createPlayer, 
  updatePlayer,
  updatePlayerField
} = require('../controllers/playerController');
const { validateLineUser } = require('../middleware/authMiddleware');

// Get player data by userId
router.get('/:userId', validateLineUser, getPlayerByUserId);

// Create a new player
router.post('/', validateLineUser, createPlayer);

// Update entire player data
router.put('/:userId', validateLineUser, updatePlayer);

// Update specific player fields
router.patch('/:userId/:field', validateLineUser, updatePlayerField);

module.exports = router;