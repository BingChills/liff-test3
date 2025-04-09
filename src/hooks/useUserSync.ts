// src/hooks/useUserSync.ts
import { useEffect, useState, useRef } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   const syncedRef = useRef(false) // Track if we've already synced
   const debugMode = false // Set to true only when debugging is needed

   // Main synchronization effect - MongoDB
   useEffect(() => {
      const syncUserData = async () => {
         // Skip if we've already synced or have user data
         if (syncedRef.current || user) {
            return
         }
         
         if (debugMode) console.log('🔄 syncUserData called - Checking conditions')
         
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            if (debugMode) console.log('❌ Cannot sync - userProfile or LIFF not available', { hasUserProfile: !!userProfile, hasLiff: !!liff })
            return
         }

         try {
            // Try to get user data from MongoDB
            if (debugMode) console.log('🌐 Attempting API call to fetch user:', userProfile.userId)
            try {
               // Use query parameter instead of path parameter - works better with Vercel
               const response = await apiClient.get('/api/player', {
                  params: { userId: userProfile.userId }
               })
               if (debugMode) console.log('🌐 API Response:', response.status)
               if (response.data) {
                  if (debugMode) console.log('✅ Found existing user data in database')
                  setUser(response.data as PlayerType)
                  syncedRef.current = true // Mark as synced
                  return
               } else {
                  if (debugMode) console.log('⚠️ API returned success but no data')
               }
            } catch (error) {
               // Player not found in database, will create a new one
               if (debugMode) console.log('⚠️ API Error:', error)
               if (debugMode) console.log('🔄 Player not found in database, creating new profile')
            }

            // Create new profile if we don't have one
            const newProfile = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || '',
               score: 0,
               stores: [],
               stamina: { current: 20, max: 20 },
               characters: [],
               coupons: []
            }

            // Save to database
            const createResponse = await apiClient.post('/api/players', newProfile)
            setUser(createResponse.data as PlayerType)
            syncedRef.current = true // Mark as synced
            if (debugMode) console.log('New user profile saved to database')
         } catch (error) {
            if (debugMode) console.error('Database sync error:', error)
         }
      }

      if (debugMode) console.log('🔄 Checking if sync is needed...')
      syncUserData()
   }, [userProfile, liff, user, debugMode])

   // Update user method that saves to database
   const updateUser = async (updatedUser: PlayerType) => {
      setUser(updatedUser)
      try {
         // Save to database
         if (debugMode) console.log('🔄 Updating user in database:', updatedUser.userId)
         const response = await apiClient.put('/api/player', updatedUser, {
            params: { userId: updatedUser.userId }
         })
         if (debugMode) console.log('✅ User updated successfully:', response.status)
      } catch (error) {
         console.error('❌ Error updating user in database:', error)
      }
   }

   return { user, setUser: updateUser }
}
