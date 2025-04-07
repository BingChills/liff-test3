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

// @desc    Create or update player data - Ultra-simplified for demo
// @route   POST /api/players
// @access  Private
const createPlayer = async (req, res) => {
   try {
      console.log('💾 Player data request received');
      
      const { userId } = req.body;

      if (!userId) {
         console.error('❌ Missing userId in request');
         return res.status(400).json({ message: 'userId is required' });
      }

      // Quick check if player exists using lean() for better performance
      const existingPlayer = await Player.findOne({ userId }).lean();

      if (existingPlayer) {
         // Performance optimization: Don't update unless absolutely necessary
         // Just return success with the existing player
         console.log(`✅ Player exists: ${userId}`);
         return res.json({ ...existingPlayer, success: true });
      }

      // Create new player with minimal fields
      const newPlayer = {
         userId,
         displayName: req.body.displayName || 'Player',
         pictureUrl: req.body.pictureUrl || null,
         statusMessage: req.body.statusMessage || null,
         score: 0,
         stores: [
            { name: "Food", point: 0, color: "#FF5722" },
            { name: "Shopping", point: 0, color: "#E91E63" },
            { name: "Entertainment", point: 0, color: "#9C27B0" },
         ],
         characters: [],
         coupons: [],
         stamina: { current: 20, max: 20 },
         createdAt: Date.now()
      };

      console.log('⚙️ Creating new player');
      const player = await Player.create(newPlayer);
      
      console.log(`✅ Created player: ${userId}`);
      res.status(201).json(player);
   } catch (error) {
      console.error('❌ Player creation error:', error.message);
      // For demo, still return success to not block the game
      res.status(200).json({
         userId: req.body.userId,
         displayName: req.body.displayName || 'Player',
         score: 0,
         success: true,
         localOnly: true
      });
   }
}

// @desc    Update player by user ID - OPTIMIZED FOR GAME CLOSE
// @route   PUT /api/players/:userId
// @access  Private
const updatePlayer = async (req, res) => {
   // IMPORTANT - THIS IS CALLED BY BEACON ON GAME CLOSE
   // The client may have already closed - must respond instantly
   
   // Immediately acknowledge receipt - don't wait for DB
   res.status(202).json({ 
      success: true, 
      message: 'Save request received - processing in background'
   });
   
   // Process the update in background AFTER response
   try {
      const { userId } = req.params;
      
      // Skip logging request body - can be large and slow things down
      console.log(`🔄 Background save for player ${userId}`);
      
      // Use updateOne with upsert for maximum efficiency
      // Much faster than findOne+save and handles new players too
      await Player.updateOne(
         { userId },
         { $set: req.body },
         { 
            upsert: true,
            runValidators: false // skip for performance
         }
      );
      
      console.log(`✅ Background save successful for ${userId}`);
   } catch (error) {
      // Just log errors - client won't see response anyway
      console.error(`❌ Background save failed: ${error.message}`);
   }
}

// @desc    Ultra-simplified score update - ONLY called from game close
// @route   PATCH /api/players/:userId/:field
// @access  Private
const updatePlayerField = async (req, res) => {
   try {
      const { userId, field } = req.params;
      const { value } = req.body;

      // Fast validation
      if (!userId || !field || value === undefined) {
         return res.status(400).json({ success: false, message: 'Missing parameters' });
      }
      
      // ULTRA MINIMALIST - JUST ACKNOWLEDGE RECEIPT
      // This function is only used by the game-close beacon
      // Process the update in the background AFTER sending response
      res.status(200).json({ success: true, message: 'Update request received' });
      
      // Background update after response is sent
      try {
         await Player.updateOne(
            { userId },
            { $set: { [field]: value } },
            { upsert: true }
         );
         console.log(`✅ Background update of ${field}=${value} for ${userId} successful`);
      } catch (err) {
         console.error(`❌ Background update failed: ${err.message}`);
      }
   } catch (error) {
      console.error('❌ Field update error:', error.message);
      res.status(500).json({ success: false, message: 'Update failed' });
   }
};

module.exports = {
   getPlayerByUserId,
   createPlayer,
   updatePlayer,
   updatePlayerField
}

