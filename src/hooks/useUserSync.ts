// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

// Global variables to store user data and track loading status
let globalUserData: PlayerType | null = null;
let userDataLoaded = false;
let userDataLoading = false;

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(globalUserData)

   // Load user data once when the component mounts
   useEffect(() => {
      // If we already have global data, use it immediately
      if (globalUserData) {
         setUser(globalUserData)
         return
      }

      // Skip if already loaded, currently loading, or missing user profile
      if (userDataLoaded || userDataLoading || !userProfile || !liff) {
         return
      }

      // Set loading flag immediately to prevent duplicate calls
      userDataLoading = true
      console.log('🔄 Starting user data synchronization...')
      
      const syncUserData = async () => {
         try {
            // Try to get user data from MongoDB
            try {
               console.log('🔍 Fetching user data for:', userProfile.userId)
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               if (response.data) {
                  const userData = response.data as PlayerType
                  console.log('✅ User data loaded successfully')
                  
                  // Update both local and global state
                  setUser(userData)
                  globalUserData = userData
                  userDataLoaded = true
                  userDataLoading = false
                  return
               }
            } catch (error) {
               // Player not found in database, will create a new one
               console.log('⚠️ User not found, creating new profile')
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
            console.log('🔍 Creating new user profile')
            const createResponse = await apiClient.post('/api/players', newProfile)
            const userData = createResponse.data as PlayerType
            console.log('✅ New user profile created')
            
            // Update both local and global state
            setUser(userData)
            globalUserData = userData
            userDataLoaded = true
         } catch (error) {
            console.error('❌ Database sync error:', error)
            userDataLoading = false
         }
      }

      syncUserData()
   }, [liff, userProfile])

   // Update user method that saves to database
   const updateUser = async (updatedUser: PlayerType) => {
      // Update both local and global state
      setUser(updatedUser)
      globalUserData = updatedUser
      
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

