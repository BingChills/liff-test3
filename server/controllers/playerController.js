const Player = require('../models/Player')

// @desc    Get player by user ID
// @route   GET /api/players/:userId
// @access  Private
const getPlayerByUserId = async (req, res) => {
   try {
      const { userId } = req.params

      // Validate userId
      if (!userId) {
         return res.status(400).json({ message: 'User ID parameter is required' })
      }

      // Look for player by LINE user ID
      const player = await Player.findOne({ userId })

      if (!player) {
         return res.status(404).json({ message: 'Player not found' })
      }

      res.json(player)
   } catch (error) {
      console.error(`Error in getPlayerByUserId: ${error.message}`)
      res.status(500).json({
         message: 'Failed to retrieve player',
         error: process.env.NODE_ENV === 'production' ? null : error.message
      })
   }
}

// @desc    Create a new player
// @route   POST /api/players
// @access  Private
const createPlayer = async (req, res) => {
   try {
      const { userId, pictureUrl, displayName, statusMessage } = req.body

      // Validate required fields
      if (!userId) {
         return res.status(400).json({ message: 'User ID is required' })
      }

      // Check if player already exists using consistent userId field
      const existingPlayer = await Player.findOne({ userId })

      if (existingPlayer) {
         return res.status(409).json({ message: 'Player already exists' })
      }

      // Create new player with minimal default values
      // Schema defaults will handle the rest
      const newPlayer = {
         userId,
         pictureUrl,
         displayName,
         statusMessage,
         score: 0,
         stores: [], // Will be populated from DB or through API
         characters: [],
         coupons: []
      }

      const player = new Player(newPlayer)
      await player.save()

      res.status(201).json(player)
   } catch (error) {
      console.error(`Error in createPlayer: ${error.message}`)
      console.error(error.stack)
      res.status(500).json({
         message: 'Failed to create player',
         error: process.env.NODE_ENV === 'production' ? null : error.message
      })
   }
}

// @desc    Update player data
// @route   PUT /api/players/:userId
// @access  Private
const updatePlayer = async (req, res) => {
   try {
      const { userId } = req.params
      const updates = req.body

      // Validate userId
      if (!userId) {
         return res.status(400).json({ message: 'User ID parameter is required' })
      }

      // Update player by LINE user ID using consistent field name
      const player = await Player.findOneAndUpdate(
         { userId },
         { ...updates, updatedAt: Date.now() },
         { new: true, runValidators: true }
      )

      if (!player) {
         return res.status(404).json({ message: 'Player not found' })
      }

      res.json(player)
   } catch (error) {
      console.error(`Error in updatePlayer: ${error.message}`)
      res.status(500).json({
         message: 'Failed to update player',
         error: process.env.NODE_ENV === 'production' ? null : error.message
      })
   }
}

// @desc    Update specific field of player data
// @route   PATCH /api/players/:userId/:field
// @access  Private
const updatePlayerField = async (req, res) => {
   try {
      const { userId, field } = req.params
      const { value } = req.body

      // Validate parameters
      if (!userId || !field) {
         return res.status(400).json({ message: 'Both userId and field parameters are required' })
      }

      if (value === undefined) {
         return res.status(400).json({ message: 'Value is required in request body' })
      }

      // Construct update object with the field to update
      const updateObject = {
         [field]: value,
         updatedAt: Date.now()
      }

      // Update player using consistent userId field
      const player = await Player.findOneAndUpdate(
         { userId },
         { $set: updateObject },
         { new: true, runValidators: true }
      )

      if (!player) {
         return res.status(404).json({ message: 'Player not found' })
      }

      res.json(player)
   } catch (error) {
      console.error(`Error in updatePlayerField: ${error.message}`)
      res.status(500).json({
         message: 'Failed to update player field',
         error: process.env.NODE_ENV === 'production' ? null : error.message
      })
   }
}

module.exports = {
   getPlayerByUserId,
   createPlayer,
   updatePlayer,
   updatePlayerField
}

