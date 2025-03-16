const Player = require('../models/Player');

// @desc    Get player by user ID
// @route   GET /api/players/:userId
// @access  Private
const getPlayerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Look for existing player
    const player = await Player.findOne({ userId });
    
    // Return 404 if player doesn't exist
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    console.error(`Error in getPlayerByUserId: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new player
// @route   POST /api/players
// @access  Private
const createPlayer = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if player already exists
    const existingPlayer = await Player.findOne({ userId });
    
    if (existingPlayer) {
      return res.status(409).json({ message: 'Player already exists' });
    }
    
    console.log('Creating new player with userId:', userId);
    
    // Create new player with default values
    const newPlayer = {
      userId,
      score: 0,
      coins: 0, 
      stores: [
        { name: 'Parabola', point: 1600, color: 'emerald' },
        { name: 'KFC', point: 850, color: 'red' },
        { name: 'Pizza Company', point: 1200, color: 'blue' },
        { name: 'Pizza Hut', point: 950, color: 'orange' }
      ],
      selectedStore: { name: 'Parabola', point: 1600, color: 'emerald' },
      stamina: { current: 20, max: 20 },
      characters: [],
      coupons: []
    };
    
    const player = new Player(newPlayer);
    await player.save();
    
    console.log('Player created successfully:', player._id);
    res.status(201).json(player);
  } catch (error) {
    console.error(`Error in createPlayer: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update player data
// @route   PUT /api/players/:userId
// @access  Private
const updatePlayer = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const player = await Player.findOneAndUpdate(
      { userId },
      { ...updates, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    console.error(`Error in updatePlayer: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update specific field of player data
// @route   PATCH /api/players/:userId/:field
// @access  Private
const updatePlayerField = async (req, res) => {
  try {
    const { userId, field } = req.params;
    const { value } = req.body;
    
    // Construct update object with the field to update
    const updateObject = {
      [field]: value,
      lastUpdated: Date.now()
    };
    
    const player = await Player.findOneAndUpdate(
      { userId },
      { $set: updateObject },
      { new: true, runValidators: true }
    );
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    console.error(`Error in updatePlayerField: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPlayerByUserId,
  createPlayer,
  updatePlayer,
  updatePlayerField
};