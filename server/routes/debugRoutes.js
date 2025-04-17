// Debug routes for checking database connectivity
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Player = require('../models/Player')

// Debug health check route
router.get('/health', async (req, res) => {
   try {
      // Check MongoDB connection status
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

      // Count total players in database
      const playerCount = await Player.countDocuments({})

      // Get connection details
      const connectionDetails = {
         host: mongoose.connection.host || 'unknown',
         name: mongoose.connection.name || 'unknown',
         readyState: dbStatus
      }

      // Return detailed health information
      res.json({
         status: 'ok',
         timestamp: new Date().toISOString(),
         environment: process.env.NODE_ENV || 'development',
         mongodb: {
            status: dbStatus,
            connectionDetails,
            playerCount
         },
         memory: process.memoryUsage(),
         serverTime: new Date().toISOString()
      })
   } catch (error) {
      console.error('Health check error:', error)
      res.status(500).json({
         status: 'error',
         message: error.message,
         stack: process.env.NODE_ENV === 'production' ? null : error.stack
      })
   }
})

// Create a test player for demo purposes
router.post('/create-test-player', async (req, res) => {
   try {
      // Create a test player with timestamp to ensure uniqueness
      const timestamp = Date.now()
      const testPlayer = {
         userId: `test-player-${timestamp}`,
         displayName: `Demo User ${timestamp}`,
         pictureUrl: '',
         statusMessage: 'This is a test player for the demo',
         score: 100,
         stores: [
            { name: 'Food', point: 50, color: '#FF5722' },
            { name: 'Shopping', point: 30, color: '#E91E63' },
            { name: 'Entertainment', point: 20, color: '#9C27B0' }
         ],
         stamina: { current: 20, max: 20 }
      }

      const player = await Player.create(testPlayer)

      res.status(201).json({
         message: 'Test player created successfully',
         player
      })
   } catch (error) {
      console.error('Failed to create test player:', error)
      res.status(500).json({
         status: 'error',
         message: error.message
      })
   }
})

module.exports = router

