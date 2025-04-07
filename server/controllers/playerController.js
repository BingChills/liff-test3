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
   console.log('💾 Creating player with data:', JSON.stringify(req.body, null, 2))
   
   try {
      const { userId, pictureUrl, displayName, statusMessage } = req.body

      // Validate required fields
      if (!userId) {
         console.error('❌ User ID missing in request body')
         return res.status(400).json({ message: 'User ID is required' })
      }

      // Check if player already exists - if so, do an upsert instead
      // This makes the API more forgiving for the demo
      const existingPlayer = await Player.findOne({ userId })

      if (existingPlayer) {
         console.log(`✅ Player already exists for userId: ${userId}, updating instead`)
         // Update the existing player with new data
         existingPlayer.displayName = displayName || existingPlayer.displayName
         existingPlayer.pictureUrl = pictureUrl || existingPlayer.pictureUrl
         existingPlayer.statusMessage = statusMessage || existingPlayer.statusMessage
         
         const updatedPlayer = await existingPlayer.save()
         return res.status(200).json(updatedPlayer)
      }

      // Create new player with minimal default values
      console.log('👤 Creating new player document in MongoDB...')
      const newPlayer = {
         userId,
         displayName,
         pictureUrl,
         statusMessage,
         score: 0,
         // Initialize with empty arrays for store data and other collections
         stores: [
            { name: "Food", point: 0, color: "#FF5722" },
            { name: "Shopping", point: 0, color: "#E91E63" },
            { name: "Entertainment", point: 0, color: "#9C27B0" },
         ],
         characters: [],
         coupons: [],
         stamina: { current: 20, max: 20 }
      }
      
      const player = await Player.create(newPlayer)
      console.log(`✅ Successfully created player: ${player._id} for userId: ${userId}`)

      res.status(201).json(player)
   } catch (error) {
      console.error('❌ Error in createPlayer:', error)
      // Always return a useful error message even in production for debugging
      res.status(500).json({
         message: 'Failed to create player',
         error: error.message
      })
   }
}

// @desc    Update player by user ID
// @route   PUT /api/players/:userId
// @access  Private
const updatePlayer = async (req, res) => {
   console.log(`💾 Updating player ${req.params.userId} with data:`, JSON.stringify(req.body, null, 2))
   
   try {
      const { userId } = req.params
      
      // Look for player by userId
      const player = await Player.findOne({ userId })

      if (!player) {
         console.error(`❌ Player not found for userId: ${userId}`)
         return res.status(404).json({ message: 'Player not found' })
      }
      
      console.log(`✅ Found player ${player._id} for userId: ${userId}`)

      // Update all fields from request body
      Object.keys(req.body).forEach(key => {
         // Don't update the userId
         if (key !== 'userId') {
            player[key] = req.body[key];
         }
      });

      // Save and return updated player
      console.log('💾 Saving updated player data...')
      const updatedPlayer = await player.save();
      console.log(`✅ Player data updated successfully for userId: ${userId}`)
      
      res.json(updatedPlayer);
   } catch (error) {
      console.error('❌ Error in updatePlayer:', error);
      // Always return a useful error message even in production for debugging
      res.status(500).json({
         message: 'Failed to update player',
         error: error.message
      });
   }
}

// @desc    Update a specific field for a player by user ID
// @route   PATCH /api/players/:userId/:field
// @access  Private
const updatePlayerField = async (req, res) => {
   try {
      const { userId, field } = req.params;
      const { value } = req.body;

      console.log(`🔄 Score update request: ${field}=${value} for user ${userId}`);

      // Validate parameters
      if (!userId || !field) {
         console.error('❌ Missing parameter:', { userId, field });
         return res.status(400).json({ message: 'Both userId and field parameters are required' });
      }

      if (value === undefined) {
         console.error('❌ Missing value in request body');
         return res.status(400).json({ message: 'Value is required in request body' });
      }

      // Special handling for score updates - simplified for better reliability
      if (field === 'score') {
         try {
            console.log(`🏆 Processing SCORE UPDATE for ${userId}: ${value}`);
            
            // Use a very direct update approach for scores
            const result = await Player.updateOne(
               { userId }, 
               { $set: { score: value } }
            );
            
            if (result.matchedCount === 0) {
               console.log(`⚠️ No player found with userId ${userId} for score update. Creating new player.`);
               
               // Create basic player if not found
               const newPlayer = {
                  userId,
                  score: value,
                  stores: [
                     { name: "Food", point: 0, color: "#FF5722" },
                     { name: "Shopping", point: 0, color: "#E91E63" },
                     { name: "Entertainment", point: 0, color: "#9C27B0" }
                  ],
                  updatedAt: Date.now()
               };
               
               const player = await Player.create(newPlayer);
               console.log(`✅ Created new player with initial score ${value}`);
               return res.status(201).json(player);
            }
            
            console.log(`✅ Score successfully updated to ${value} for player ${userId}`);
            return res.json({ userId, field, value, success: true });
         } catch (scoreError) {
            console.error('❌ Error in score update:', scoreError);
            return res.status(500).json({ 
               message: 'Failed to update score', 
               error: scoreError.message 
            });
         }
      }
      
      // Standard update for non-score fields
      console.log(`📝 Updating non-score field: ${field}=${value}`);
      
      // Construct update object
      const updateObject = {
         [field]: value,
         updatedAt: Date.now()
      };

      // Simple update operation
      const player = await Player.findOneAndUpdate(
         { userId },
         { $set: updateObject },
         { new: true }
      );

      if (!player) {
         console.error(`❌ Player not found with userId: ${userId}`);
         return res.status(404).json({ message: 'Player not found' });
      }

      console.log(`✅ Updated ${field} to ${value} for player ${userId}`);
      res.json(player);
   } catch (error) {
      console.error('❌ Error updating player field:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
   }
}

module.exports = {
   getPlayerByUserId,
   createPlayer,
   updatePlayer,
   updatePlayerField
}

