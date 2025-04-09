// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

// Global flag to prevent multiple API calls when navigating between pages
let userDataLoaded = false

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)

   // Load user data once when the component mounts
   useEffect(() => {
      // Skip if already loaded or missing user profile
      if (userDataLoaded || !userProfile || !liff) {
         return
      }

      // Set flag immediately to prevent duplicate calls
      userDataLoaded = true

      const syncUserData = async () => {
         try {
            // Try to get user data from MongoDB
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               if (response.data) {
                  setUser(response.data as PlayerType)
                  return
               }
            } catch (error) {
               // Player not found in database, will create a new one
               console.log('⚠️ API Error:', error)
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
         } catch (error) {
            console.error('Database sync error:', error)
         }
      }

      syncUserData()
   }, [liff, userProfile])

   // Update user method that saves to database
   const updateUser = async (updatedUser: PlayerType) => {
      setUser(updatedUser)
      try {
         // Save to database
         const response = await apiClient.put(`/api/players/${updatedUser.userId}`, updatedUser)
         console.log('✅ User updated successfully:', response.status)
      } catch (error) {
         console.error('❌ Error updating user in database:', error)
      }
   }

   return { user, updateUser }
}

