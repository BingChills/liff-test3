// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)

   // Main synchronization effect - MongoDB
   useEffect(() => {
      const syncUserData = async () => {
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            return
         }

         try {
            // Try to get user data from MongoDB
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               if (response.data) {
                  console.log('✅ Found existing user data in database')
                  setUser(response.data as PlayerType)
                  return
               }
            } catch (error) {
               // Player not found in database, will create a new one
               console.log('Player not found in database, creating new profile')
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
            console.log('New user profile saved to database')
         } catch (error) {
            console.error('Database sync error:', error)
         }
      }

      syncUserData()
   }, [userProfile, liff])

   // Update user method that saves to database
   const updateUser = async (updatedUser: PlayerType) => {
      setUser(updatedUser)
      try {
         // Save to database
         await apiClient.put(`/api/players/${updatedUser.userId}`, updatedUser)
      } catch (error) {
         console.error('Error updating user in database:', error)
      }
   }

   return { user, setUser: updateUser }
}
