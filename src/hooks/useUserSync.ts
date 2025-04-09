// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   
   console.log('🔍 useUserSync Hook - LIFF Status:', liff ? 'Initialized' : 'Not Initialized')
   console.log('🔍 useUserSync Hook - User Profile:', userProfile)

   // Main synchronization effect - MongoDB
   useEffect(() => {
      const syncUserData = async () => {
         console.log('🔄 syncUserData called - Checking conditions')
         
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            console.log('❌ Cannot sync - userProfile or LIFF not available', { hasUserProfile: !!userProfile, hasLiff: !!liff })
            return
         }

         try {
            // Try to get user data from MongoDB
            console.log('🌐 Attempting API call to fetch user:', userProfile.userId)
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               console.log('🌐 API Response:', response.status)
               if (response.data) {
                  console.log('✅ Found existing user data in database')
                  setUser(response.data as PlayerType)
                  return
               } else {
                  console.log('⚠️ API returned success but no data')
               }
            } catch (error) {
               // Player not found in database, will create a new one
               console.log('⚠️ API Error:', error)
               console.log('🔄 Player not found in database, creating new profile')
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

      console.log('🔄 Calling syncUserData...')
      syncUserData()
   }, [userProfile, liff])

   // Update user method that saves to database
   const updateUser = async (updatedUser: PlayerType) => {
      setUser(updatedUser)
      try {
         // Save to database
         console.log('🔄 Updating user in database:', updatedUser.userId)
         const response = await apiClient.put(`/api/players/${updatedUser.userId}`, updatedUser)
         console.log('✅ User updated successfully:', response.status)
      } catch (error) {
         console.error('❌ Error updating user in database:', error)
      }
   }

   return { user, setUser: updateUser }
}
